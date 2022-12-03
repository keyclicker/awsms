from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from starlette import status

import database
import schemas
import crud

router = APIRouter()
security = HTTPBearer()


@router.post('/', response_model=schemas.Good, dependencies=[Depends(security)])
async def create(new_good: schemas.GoodCreate, session: Session = Depends(database.get_session)):
    return crud.create_good(session=session, good=new_good)


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
