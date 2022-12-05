from typing import Optional
from pydantic import BaseModel


class GoodList(BaseModel):
    good_ids: list[int]


class GoodCreate(BaseModel):
    name: str
    image: str
    price: float
    category: str
    description: str
    count: int
    specs: dict


class GoodIn(BaseModel):
    id: int
    name: Optional[str]
    image: Optional[str]
    price: Optional[float]
    category: Optional[str]
    description: Optional[str]
    count: Optional[int]
    specs: Optional[dict]


class Good(BaseModel):
    id: Optional[int]
    name: Optional[str]
    image: Optional[str]
    price: Optional[float]
    category: Optional[str]
    description: Optional[str]
    count: Optional[int]
    specs: Optional[dict]

    class Config:
        orm_mode = True


class FilterGood(BaseModel):
    query: Optional[str]
    category: Optional[str]
    min_price: Optional[float]
    max_price: Optional[float]
    available: Optional[bool]
