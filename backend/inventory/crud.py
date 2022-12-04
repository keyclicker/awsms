from sqlalchemy.orm import Session

import models
import schemas


def get_goods(session: Session, skip: int = 0, limit: int = 100):
    return session.query(models.Good) \
        .order_by(models.Good.id.asc()) \
        .offset(skip) \
        .limit(limit) \
        .all()


def get_good_by_id(session: Session, good_id: int):
    return session.query(models.Good).filter(models.Good.id == good_id).first()


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
