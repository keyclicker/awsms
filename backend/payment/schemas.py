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
    created_at: Optional[datetime]
    status: Optional[str]
    user_username: Optional[str]
    phone_number: Optional[str]
    country: Optional[str]
    city: Optional[str]
    street: Optional[str]
    zip: Optional[str]

    class Config:
        orm_mode = True


class OrderCreate(BaseModel):
    user_username: str
    phone_number: Optional[str]
    country: Optional[str]
    city: Optional[str]
    street: Optional[str]
    zip: Optional[str]
    goods: list[OrderGoodCreate]


class OrderIn(BaseModel):
    id: int
    created_at: Optional[datetime]
    status: Optional[str]
    user_username: Optional[str]
    phone_number: Optional[str]
    country: Optional[str]
    city: Optional[str]
    street: Optional[str]
    zip: Optional[str]


class FullOrder(BaseModel):
    class Good(BaseModel):
        id: Optional[int]
        good_id: Optional[int]
        count: Optional[int]

    id: Optional[int]
    created_at: Optional[datetime]
    status: Optional[str]
    user_username: Optional[str]
    phone_number: Optional[str]
    country: Optional[str]
    city: Optional[str]
    street: Optional[str]
    zip: Optional[str]
    goods: list[Good]
