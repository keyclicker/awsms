import config

from sqlalchemy import Column, String


class User(config.Base):
    __tablename__ = 'user'

    username = Column(String, primary_key=True)
    hashed_password = Column(String)
