from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class OrderGoodCreate(BaseModel):
    good_id: int
    count: int


class OrderGood(BaseModel):
    id: Optional[int]
    good_id: Optional[int]
    count: Optional[int]
    order_id: Optional[int]

    class Config:
        orm_mode = True


class Order(BaseModel):
    id: Optional[int]
    user_username: Optional[str]
    created_at: Optional[datetime]
    status: Optional[str]

    class Config:
        orm_mode = True


class OrderCreate(BaseModel):
    user_username: str
    goods: list[OrderGoodCreate]


class OrderIn(BaseModel):
    id: int
    user_username: Optional[str]
    created_at: Optional[datetime]
    status: Optional[str]


class FullOrder(BaseModel):
    class Good(BaseModel):
        id: Optional[int]
        good_id: Optional[int]
        count: Optional[int]

    id: Optional[int]
    user_username: Optional[str]
    created_at: Optional[datetime]
    status: Optional[str]
    goods: list[Good]
