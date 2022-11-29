from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field, validator, root_validator
from pydantic.generics import GenericModel

T = TypeVar('T')


class UserSchema(BaseModel):
    username: Optional[str]
    hashed_password: Optional[str]

    class Config:
        orm_mode = True


class RequestUser(BaseModel):
    username: str
    password: str


class Response(GenericModel, Generic[T]):
    code: str
    status: str
    message: str
    result: Optional[T]
