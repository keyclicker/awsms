from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.dialects.postgresql import JSON

import database


class Good(database.Base):
    __tablename__ = 'good'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    image = Column(String)
    price = Column(Float)
    category = Column(String)
    description = Column(String)
    count = Column(Integer)
    specs = Column(JSON)
