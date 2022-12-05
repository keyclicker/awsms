from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, backref

import database


class Order(database.Base):
    __tablename__ = 'order'

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime)
    status = Column(String)  # pending | completed | refunded
    user_username = Column(String)
    phone_number = Column(String)
    country = Column(String)
    city = Column(String)
    street = Column(String)
    zip = Column(String)

    goods = relationship('OrderGood', cascade='all, delete-orphan')


class OrderGood(database.Base):
    __tablename__ = 'order_good'

    id = Column(Integer, primary_key=True, index=True)
    good_id = Column(Integer)
    count = Column(Integer)
    order_id = Column(Integer, ForeignKey("order.id"), nullable=False)
