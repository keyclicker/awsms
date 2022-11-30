import database

from sqlalchemy import Column, String


class User(database.Base):
    __tablename__ = 'user'

    username = Column(String, primary_key=True)
    hashed_password = Column(String)
