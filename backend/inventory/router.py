from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session

import config
import schema
import crud

router = APIRouter()


def get_db():
    db = config.SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post('/create')
async def create(request: schema.RequestProduct, db: Session = Depends(get_db)) -> dict:
    crud.create_product(db, request.parameter)

    return schema.Response(
        code=200,
        status='Ok',
        message="Product create successfully"
    ).dict(exclude_none=True)


@router.get('/')
async def get(db: Session = Depends(get_db)) -> dict:
    _products = crud.get_products(db)

    return schema.Response(
        code=200,
        status='Ok',
        message="Successfully fetch all products",
        result=_products
    ).dict(exclude_none=True)


@router.get('/{id}')
async def get_by_id(product_id: int, db: Session = Depends(get_db)) -> dict:
    _product = crud.get_product_by_id(db, product_id)

    return schema.Response(
        code=200,
        status='Ok',
        message="Successfully fetch product",
        result=_product
    ).dict(exclude_none=True)


@router.put('/update')
async def update(request: schema.RequestProduct, db: Session = Depends(get_db)) -> dict:
    _product = crud.update_product(
        db=db,
        product_id=request.parameter.id,
        name=request.parameter.name,
        price=request.parameter.price,
        quantity=request.parameter.quantity
    )

    return schema.Response(
        code=200,
        status='Ok',
        message="Successfully update product",
        result=_product
    ).dict(exclude_none=True)


@router.delete('/delete')
async def delete(product_id: int, db: Session = Depends(get_db)) -> dict:
    crud.delete_product(db, product_id)

    return schema.Response(
        code=200,
        status='Ok',
        message="Successfully delete product",
    ).dict(exclude_none=True)
