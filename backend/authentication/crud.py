from sqlalchemy.orm import Session

import model
import schema


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(model.User).offset(skip).limit(limit).all()


def get_user_by_username(db: Session, username: str):
    return db.query(model.User).filter(model.User.username == username).first()


def create_user(db: Session, user_schema: schema.UserSchema):
    user = model.User(
        username=user_schema.username,
        hashed_password=user_schema.hashed_password,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def delete_user(db: Session, username: str):
    user = get_user_by_username(db, username)

    db.delete(user)
    db.commit()
