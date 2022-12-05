from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from fastapi.security import HTTPBearer
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from starlette import status

import database
import schemas
import crud

router = APIRouter()
security = HTTPBearer()


@router.get('/categories', dependencies=[Depends(security)])
async def get_all_categories(session: Session = Depends(database.get_session)):
    categories = crud.get_all_categories(session=session)

    return JSONResponse(content={
        'categories': [category[0] for category in categories]
    })


@router.get('/search', dependencies=[Depends(security)])
async def search(filter_good: schemas.FilterGood, session: Session = Depends(database.get_session)):
    content = crud.filter_goods(session=session, filter_good=filter_good)

    return JSONResponse(content=content)


@router.get('/list', dependencies=[Depends(security)])
async def get_goods_by_ids(good_list: schemas.GoodList, session: Session = Depends(database.get_session)):
    return crud.get_goods_by_ids(session=session, good_ids=good_list.good_ids)


@router.post('/', response_model=schemas.Good, dependencies=[Depends(security)])
async def create(good_data: schemas.GoodCreate, session: Session = Depends(database.get_session)):
    return crud.create_good(session=session, good_data=good_data)


@router.get('/', dependencies=[Depends(security)])
async def get_all_goods(session: Session = Depends(database.get_session)):
    return crud.get_goods(session)


@router.get('/{good_id}', response_model=schemas.Good, dependencies=[Depends(security)])
async def get_good_by_id(good_id: int, session: Session = Depends(database.get_session)):
    good = crud.get_good_by_id(session=session, good_id=good_id)

    if good is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Could not find the good',
        )

    return good


@router.put('/', response_model=schemas.Good, dependencies=[Depends(security)])
async def update_good(updated_good: schemas.GoodIn, session: Session = Depends(database.get_session)):
    good = crud.update_good(session=session, updated_good=updated_good)

    if not good:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Could not find the good',
        )

    return good


@router.delete('/{good_id}', dependencies=[Depends(security)])
async def delete_good(good_id: int, session: Session = Depends(database.get_session)):
    result = crud.delete_good(session=session, good_id=good_id)

    if result is False:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Could not find the good',
        )

    return {'message': 'Ok'}
