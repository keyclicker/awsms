import config

from sqlalchemy import Column, Integer, String, Float


class Product(config.Base):
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Float)
    quantity = Column(Integer)
