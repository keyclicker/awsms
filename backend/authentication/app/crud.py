from sqlalchemy.orm import Session

from app import models, schemas


def get_users(session: Session):
    return session.query(models.User).all()


def get_user_by_username(session: Session, username: str):
    return session.query(models.User).filter(models.User.username == username).first()


def create_user(session: Session, user_schema: schemas.User):
    user = models.User(
        username=user_schema.username,
        hashed_password=user_schema.hashed_password,
        full_name=user_schema.full_name,
        role='ranker'
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


def update_user(session: Session, updated_user: schemas.UserIn):
    user = get_user_by_username(session, updated_user.username)

    if user is None:
        return None

    for key, value in user.dict().items():
        if key == 'id':
            continue

        if value is not None:
            setattr(user, key, value)

    session.commit()
    session.refresh(user)

    return user


def delete_user(session: Session, username: str):
    user = get_user_by_username(session, username)

    session.delete(user)
    session.commit()
