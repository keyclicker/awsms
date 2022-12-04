from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

import database


class OrderGood(database.Base):
    __tablename__ = 'order_good'

    id = Column(Integer, primary_key=True, index=True)
    good_id = Column(Integer)
    count = Column(Integer)
    order_id = Column(Integer, ForeignKey("order.id"), nullable=False)


class Order(database.Base):
    __tablename__ = 'order'

    id = Column(Integer, primary_key=True, index=True)
    user_username = Column(String)
    created_at = Column(DateTime)
    status = Column(String)  # pending | completed | refunded

    goods = relationship("OrderGood")
