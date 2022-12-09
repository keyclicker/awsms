from sqlalchemy.orm import Session

from app import models
from app import schemas


def get_users(session: Session, skip: int = 0, limit: int = 100):
    return session.query(models.User).offset(skip).limit(limit).all()


def get_user_by_username(session: Session, username: str):
    return session.query(models.User).filter(models.User.username == username).first()


def create_user(session: Session, user_schema: schemas.User):
    user = models.User(
        username=user_schema.username,
        hashed_password=user_schema.hashed_password,
        full_name=user_schema.full_name,
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


def delete_user(session: Session, username: str):
    user = get_user_by_username(session, username)

    session.delete(user)
    session.commit()
