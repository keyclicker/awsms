from fastapi import FastAPI, HTTPException
from fastapi.params import Depends
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.background import BackgroundTasks
from sqlalchemy.orm import Session
from starlette import status
from starlette.middleware.cors import CORSMiddleware
from app import database, schemas, crud

import requests
import pickle
import time

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_methods=['*'],
    allow_headers=['*']
)

security = HTTPBearer()


@app.post('/all', dependencies=[Depends(security)])
async def get_all_orders(session: Session = Depends(database.get_session)):
    return crud.get_full_orders(session=session)


@app.post('/user')
async def get_user_orders(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(database.get_session)
):
    headers = {'Authorization': 'Bearer ' + credentials.credentials}

    user_json = requests.post(url='http://127.0.0.1:8002/me', headers=headers).json()

    if 'username' not in user_json:
        return user_json

    content = []

    order_models = crud.get_full_orders_by_username(session=session, username=user_json['username'])

    for order_model in order_models:
        order = schemas.Order.from_orm(order_model).dict()
        order['created_at'] = order_model.created_at.isoformat()
        order['goods'] = []

        for order_good_model in order_model.goods:
            order_good = schemas.OrderGood.from_orm(order_good_model).dict(exclude={'good_id': True, 'order_id': True})

            order_good['good'] = requests.post(
                url=f'http://127.0.0.1:8000/goods/{order_good_model.good_id}',
                headers=headers | {'Content-Type': 'application/json'},
            ).json()

            if 'id' not in order_good['good']:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f'Could not find good by {order_good_model.good_id}',
                )

            order['goods'].append(order_good)

        content.append(order)

    return JSONResponse(content=content)


@app.post('/create', response_model=schemas.Order, dependencies=[Depends(security)])
async def create_order(
    order_data: schemas.OrderCreate,
    background_tasks: BackgroundTasks,  # automatically gets value
    session: Session = Depends(database.get_session)
):
    order = crud.create_order(session=session, order_data=order_data)

    background_tasks.add_task(complete_order, order, session)

    return order


@app.post('/orders/{order_id}', response_model=schemas.FullOrder, dependencies=[Depends(security)])
async def get_order_by_id(order_id: int, session: Session = Depends(database.get_session)):
    order = crud.get_order_by_id(session=session, order_id=order_id)

    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Could not find the good',
        )

    order_goods = crud.get_order_goods_by_order_id(session=session, order_id=order.id)

    full_order = schemas.FullOrder(
        id=order.id,
        user_username=order.user_username,
        created_at=order.created_at,
        status=order.status,
        goods=[schemas.FullOrder.Good(id=good.id, good_id=good.good_id, count=good.count) for good in order_goods]
    )

    return full_order


@app.post('/delete/{order_id}', dependencies=[Depends(security)])
async def delete_order(order_id: int, session: Session = Depends(database.get_session)):
    result = crud.delete_order(session=session, order_id=order_id)

    if result is False:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Could not find the good',
        )

    return JSONResponse(content={'message': 'success'})


def complete_order(order: schemas.Order, session: Session):
    time.sleep(5)

    order_id = order.id

    updated_order = schemas.OrderIn(
        id=order_id,
        status='completed'
    )

    crud.update_order(session=session, updated_order=updated_order)

    order_goods_model = crud.get_order_goods_by_order_id(session=session, order_id=order_id)
    order_goods = [schemas.OrderGood.from_orm(order_good_model) for order_good_model in order_goods_model]

    fields = {
        'order_id': order_id,
        'goods': [order_good.dict(include={'good_id': True, 'count': True}) for order_good in order_goods]
    }

    print('send message to inventory service')

    database.redis.xadd(
        name='complete_order',
        fields={'pickle': pickle.dumps(fields)}
    )
