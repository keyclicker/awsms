from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class TokenPayload(BaseModel):
    subject: str
    expiration_time: datetime
    issued_at: datetime

    def to_jwt_payload(self):
        return {
            'sub': self.subject,
            'exp': self.expiration_time,
            'iat': self.issued_at
        }


class UserCreate(BaseModel):
    username: str
    full_name: str
    password: str


class UserAuth(BaseModel):
    username: str
    password: str


class UserIn(BaseModel):
    username: str
    hashed_password: Optional[str]
    full_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    role: Optional[str]
    image: Optional[str]
    country: Optional[str]
    city: Optional[str]
    address: Optional[str]
    zip: Optional[str]


class User(BaseModel):
    username: Optional[str]
    hashed_password: Optional[str]
    full_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    role: Optional[str]
    image: Optional[str]
    country: Optional[str]
    city: Optional[str]
    address: Optional[str]
    zip: Optional[str]

    class Config:
        orm_mode = True
