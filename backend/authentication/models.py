import database

from sqlalchemy import Column, String


class User(database.Base):
    __tablename__ = 'user'

    username = Column(String, primary_key=True)
    hashed_password = Column(String)
    full_name = Column(String)
    email = Column(String)
    phone = Column(String)
    role = Column(String)
    image = Column(String)
    country = Column(String)
    city = Column(String)
    address = Column(String)
    zip = Column(String)
