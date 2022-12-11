from fastapi import FastAPI, HTTPException
from fastapi.params import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from starlette import status
from starlette.middleware.cors import CORSMiddleware
from app import database, schemas, crud

import requests

AUTHENTICATION_URL = 'http://authentication:8000'

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_methods=['*'],
    allow_headers=['*']
)

security = HTTPBearer()


@app.post('/all')
async def get_all_goods(session: Session = Depends(database.get_session)):
    return crud.get_goods(session)


@app.post('/categories')
async def get_all_categories(session: Session = Depends(database.get_session)):
    categories = crud.get_all_categories(session=session)

    return JSONResponse(content={
        'categories': [category[0] for category in categories]
    })


@app.post('/search')
async def search(filter_good: schemas.FilterGood, session: Session = Depends(database.get_session)):
    content = crud.filter_goods(session=session, filter_good=filter_good)

    return JSONResponse(content=content)


@app.post('/update', response_model=schemas.Good, dependencies=[Depends(security)])
async def update_good(
    updated_good: schemas.GoodIn,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(database.get_session)
):
    user = requests.post(
        url=f'{AUTHENTICATION_URL}/me',
        headers={'Authorization': 'Bearer ' + credentials.credentials}
    ).json()

    if 'username' not in user:
        return user

    if user.get('role') != 'admin':
        return {'message': 'you don\'t have enough privileges'}

    good = crud.update_good(session=session, updated_good=updated_good)

    if not good:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Could not find the good',
        )

    return good


@app.post('/create', response_model=schemas.Good, dependencies=[Depends(security)])
async def create(good_data: schemas.GoodCreate, session: Session = Depends(database.get_session)):
    return crud.create_good(session=session, good_data=good_data)


@app.post('/delete/{good_id}', dependencies=[Depends(security)])
async def delete_good(good_id: int, session: Session = Depends(database.get_session)):
    result = crud.delete_good(session=session, good_id=good_id)

    if result is False:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Could not find the good',
        )

    return JSONResponse(content={'message': 'success'})


@app.post('/goods/{good_id}', response_model=schemas.Good, dependencies=[Depends(security)])
async def get_good_by_id(good_id: int, session: Session = Depends(database.get_session)):
    good = crud.get_good_by_id(session=session, good_id=good_id)

    if good is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Could not find the good',
        )

    return good

# @app.get('/list', dependencies=[Depends(security)])
# async def get_goods_by_ids(good_list: schemas.GoodList, session: Session = Depends(database.get_session)):
#     return crud.get_goods_by_ids(session=session, good_ids=good_list.good_ids)
