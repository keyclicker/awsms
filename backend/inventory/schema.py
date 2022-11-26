from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field, validator, root_validator
from pydantic.generics import GenericModel

T = TypeVar('T')


class ProductSchema(BaseModel):
    id: Optional[int]
    name: Optional[str]
    price: Optional[float]
    quantity: Optional[int]

    class Config:
        orm_mode = True


class RequestProduct(BaseModel):
    parameter: ProductSchema = Field(...)


class Response(GenericModel, Generic[T]):
    code: str
    status: str
    message: str
    result: Optional[T]
