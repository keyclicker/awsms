from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from fastapi.security import HTTPBearer
from fastapi.background import BackgroundTasks
from sqlalchemy.orm import Session
from starlette import status
from redis_om import get_redis_connection, HashModel

import time
import database
import schemas
import crud

router = APIRouter()
security = HTTPBearer()

redis = get_redis_connection(
    host='redis-16799.c293.eu-central-1-1.ec2.cloud.redislabs.com',
    port=16799,
    password='cALu8Gy1NFs88QL7R5jUDUL6U6SfVNwj',
    decode_responses=True
)


@router.get('/', dependencies=[Depends(security)])
async def get_all_orders(session: Session = Depends(database.get_session)):
    return crud.get_full_orders(session=session)


@router.get('/{order_id}', response_model=schemas.FullOrder, dependencies=[Depends(security)])
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


@router.delete('/{order_id}', dependencies=[Depends(security)])
async def delete_order(order_id: int, session: Session = Depends(database.get_session)):
    result = crud.delete_order(session=session, order_id=order_id)

    if result is False:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Could not find the good',
        )

    return {'message': 'Ok'}


@router.post('/', response_model=schemas.Order, dependencies=[Depends(security)])
async def create_order(
    order_data: schemas.OrderCreate,
    background_tasks: BackgroundTasks,  # automatically gets value
    session: Session = Depends(database.get_session)
):
    order = crud.create_order(session=session, order_data=order_data)

    background_tasks.add_task(complete_order, order, session)

    return order


def complete_order(order: schemas.Order, session: Session):
    time.sleep(5)

    updated_order = schemas.OrderIn(
        id=order.id,
        status='completed'
    )

    order = crud.update_order(session=session, updated_order=updated_order)

    redis.xadd('order_completed', order.__dict__, '*')  # '*' - auto generated id
