from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from app import models, schemas


# orders
def get_orders(session: Session) -> list[models.Order]:
    return session.query(models.Order) \
        .order_by(models.Order.id.asc()) \
        .all()


def get_full_orders(session: Session):
    return session.query(models.Order) \
        .options(joinedload(models.Order.goods).load_only('good_id', 'count')) \
        .join(models.OrderGood, models.Order.id == models.OrderGood.order_id) \
        .group_by(models.Order.id) \
        .all()


def get_full_orders_by_username(session: Session, username: str):
    return session.query(models.Order) \
        .options(joinedload(models.Order.goods).load_only('good_id', 'count')) \
        .join(models.OrderGood, models.Order.id == models.OrderGood.order_id) \
        .filter(models.Order.user_username == username) \
        .group_by(models.Order.id) \
        .all()


def get_order_by_id(session: Session, order_id: int) -> models.Order:
    return session.query(models.Order).filter(models.Order.id == order_id).first()


def create_order(session: Session, order_data: schemas.OrderCreate) -> models.Order:
    order = models.Order(
        created_at=datetime.utcnow(),
        status='pending',
        user_username=order_data.user_username,
        phone_number=order_data.phone_number,
        country=order_data.country,
        city=order_data.city,
        street=order_data.street,
        zip=order_data.zip
    )

    session.add(order)
    session.commit()
    session.refresh(order)

    for order_good_data in order_data.goods:
        create_order_good(session, order_good_data, order.id)

    return order


def delete_order(session: Session, order_id: int) -> bool:
    order = get_order_by_id(session, order_id)

    if order is None:
        return False

    session.delete(order)
    session.commit()

    return True


def update_order(session: Session, updated_order: schemas.OrderIn):
    order = get_order_by_id(session, updated_order.id)

    if order is None:
        return None

    for key, value in updated_order.dict().items():
        if key == 'id':
            continue

        if value is not None:
            setattr(order, key, value)

    session.commit()
    session.refresh(order)

    return order


# order good
def get_order_goods_by_order_id(session: Session, order_id: int) -> list[models.OrderGood]:
    return session.query(models.OrderGood) \
        .join(models.Order) \
        .filter(models.Order.id == order_id) \
        .all()


def create_order_good(session: Session, order_good_data: schemas.OrderGoodCreate, order_id: int) -> models.OrderGood:
    order_good = models.OrderGood(
        good_id=order_good_data.good_id,
        count=order_good_data.count,
        order_id=order_id
    )

    session.add(order_good)
    session.commit()
    session.refresh(order_good)

    return order_good
