from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import HTTPException

import jwt


class Authentication:
    _hasher = CryptContext(schemes=['bcrypt'])
    _secret = 'APP_SECRET_STRING'  # os.getenv('APP_SECRET_STRING')

    def encode_password(self, password: str):
        return self._hasher.hash(password)

    def verify_password(self, password: str, hashed_password: str):
        return self._hasher.verify(password, hashed_password)

    def encode_token(self, username: str) -> str:
        payload = {
            'exp': datetime.utcnow() + timedelta(days=0, minutes=30),
            'iat': datetime.utcnow(),
            'scope': 'access_token',
            'username': username
        }

        return jwt.encode(
            payload=payload,
            key=self._secret,
            algorithm='HS256'
        )

    def decode_token(self, token: str) -> str:
        try:
            payload = jwt.decode(token, self._secret, algorithms=['HS256'])

            if payload['scope'] == 'access_token':
                return payload['username']

            raise HTTPException(status_code=401, detail='Scope for the token is invalid')

        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail='Token expired')

        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail='Invalid token')

    def encode_refresh_token(self, username: str) -> str:
        payload = {
            'exp': datetime.utcnow() + timedelta(days=0, hours=10),
            'iat': datetime.utcnow(),
            'scope': 'refresh_token',
            'username': username
        }

        return jwt.encode(
            payload=payload,
            key=self._secret,
            algorithm='HS256'
        )

    def decode_refresh_token(self, refresh_token: str) -> str:
        try:
            payload = jwt.decode(refresh_token, self._secret, algorithms=['HS256'])

            if payload['scope'] == 'refresh_token':
                username = payload['username']
                new_token = self.encode_token(username)

                return new_token

            raise HTTPException(status_code=401, detail='Scope for the token is invalid')

        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail='Token expired')

        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail='Invalid token')
