from sqlalchemy.orm import Session

import model
import schema


def get_books(db: Session, skip: int = 0, limit: int = 100):
    return db.query(model.Product).offset(skip).limit(limit).all()


def get_book_by_id(db: Session, product_id: int):
    return db.query(model.Product).filter(model.Product.id == product_id).first()


def create_book(db: Session, product: schema.ProductSchema):
    _product = model.Product(
        id=product.id,
        name=product.name,
        price=product.price,
        quantity=product.quantity
    )

    db.add(_product)
    db.commit()
    db.refresh(_product)

    return _product


def delete_book(db: Session, product_id: int):
    _product = get_book_by_id(db, product_id)

    db.delete(_product)
    db.commit()


def update_book(db: Session, product_id: int, name: str, price: float, quantity: int):
    _product = get_book_by_id(db, product_id)
    _product.name = name
    _product.price = price
    _product.quantity = quantity

    db.commit()
    db.refresh(_product)

    return _product
