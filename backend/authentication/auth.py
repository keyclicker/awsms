from passlib.context import CryptContext
from datetime import datetime, timedelta
from schemas import TokenPayload

import jwt

ACCESS_TOKEN_EXPIRE_MINUTES = 20
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
ALGORITHM = 'HS256'
JWT_ACCESS_SECRET_KEY = 'JWT_ACCESS_SECRET_KEY'
JWT_REFRESH_SECRET_KEY = 'JWT_REFRESH_SECRET_KEY'

hasher = CryptContext(schemes=['bcrypt'])


def hash_password(password: str) -> str:
    return hasher.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return hasher.verify(password, hashed_password)


def create_access_token(username: str) -> str:
    payload = TokenPayload(
        subject=username,
        expiration_time=datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        issued_at=datetime.utcnow()
    )

    return jwt.encode(payload=payload.to_jwt_payload(), key=JWT_ACCESS_SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> TokenPayload:
    jwt_payload = jwt.decode(jwt=token, key=JWT_ACCESS_SECRET_KEY, algorithms=[ALGORITHM])

    return TokenPayload(
        subject=jwt_payload.get('sub'),
        expiration_time=jwt_payload.get('exp'),
        issued_at=jwt_payload.get('iat')
    )


def create_refresh_token(username: str) -> str:
    payload = TokenPayload(
        subject=username,
        expiration_time=datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES),
        issued_at=datetime.utcnow()
    )

    return jwt.encode(payload=payload.to_jwt_payload(), key=JWT_REFRESH_SECRET_KEY, algorithm=ALGORITHM)
