from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class Token(BaseModel):
    access_token: str
    refresh_token: str


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


class UserAuth(BaseModel):
    username: str
    password: str


class User(BaseModel):
    username: Optional[str]
    hashed_password: Optional[str]

    class Config:
        orm_mode = True
