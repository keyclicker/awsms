from sqlalchemy import func, select
from sqlalchemy.orm import Session

import models
import schemas


# goods
def get_goods(session: Session):
    return session.query(models.Good) \
        .order_by(models.Good.id.asc()) \
        .all()


def get_good_by_id(session: Session, good_id: int):
    return session.query(models.Good).filter(models.Good.id == good_id).first()


def get_goods_by_ids(session: Session, good_ids: list[int]):
    return session.query(models.Good) \
        .filter(models.Good.id.in_(good_ids)) \
        .all()


def create_good(session: Session, good_data: schemas.GoodCreate):
    good = models.Good(
        name=good_data.name,
        image=good_data.image,
        price=good_data.price,
        category=good_data.category,
        description=good_data.description,
        count=good_data.count,
        specs=good_data.specs
    )

    session.add(good)
    session.commit()
    session.refresh(good)

    return good


def delete_good(session: Session, good_id: int) -> bool:
    good = get_good_by_id(session, good_id)

    if good is None:
        return False

    session.delete(good)
    session.commit()

    return True


def update_good(session: Session, updated_good: schemas.GoodIn):
    good = get_good_by_id(session, updated_good.id)

    if good is None:
        return None

    for key, value in updated_good.dict().items():
        if key == 'id':
            continue

        if value is not None:
            setattr(good, key, value)

    session.commit()
    session.refresh(good)

    return good


def filter_goods(session: Session, filter_good: schemas.FilterGood) -> dict:
    query = session.query(models.Good)

    if filter_good.query is not None:
        query = query.filter(models.Good.name.like(f'%{filter_good.query}%'))

    if filter_good.category is not None:
        query = query.filter(models.Good.category.like(f'%{filter_good.category}%'))

    if filter_good.min_price is not None:
        query = query.filter(models.Good.price >= filter_good.min_price)

    if filter_good.max_price is not None:
        query = query.filter(models.Good.price <= filter_good.max_price)

    if filter_good.available is not None:
        query = query.filter(models.Good.count > 0)

    if query.count() == 0:
        return {'count': 0}

    return {
        'count': query.count(),
        'min_price': query.order_by(models.Good.price.asc()).first().price,
        'max_price': query.order_by(models.Good.price.desc()).first().price,
        'goods': [schemas.Good.from_orm(good).dict() for good in query.all()]
    }


# categories
def get_all_categories(session: Session):
    return session.query(models.Good.category) \
        .group_by(models.Good.category) \
        .all()
