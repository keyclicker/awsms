from fastapi import APIRouter
from fastapi.params import Depends, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from authentication import Authentication

import config
import schema
import crud

router = APIRouter()
security = HTTPBearer()
authentication_handler = Authentication()


def get_db():
    db = config.SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get('/', dependencies=[Depends(security)])
async def get_users(db: Session = Depends(get_db)):
    users = crud.get_users(db)

    return users


@router.post('/signup')
async def signup(request: schema.RequestUser, db: Session = Depends(get_db)):
    if crud.get_user_by_username(db, request.username) is not None:
        return {'message': 'User already exist'}

    # TODO: add try
    hashed_password = authentication_handler.encode_password(request.password)

    user = crud.create_user(db, schema.UserSchema(username=request.username, hashed_password=hashed_password))

    return user


@router.post("/login")
async def login(request: schema.RequestUser, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, request.username)

    if user is None:
        return {'message': 'Invalid username'}

    if not authentication_handler.verify_password(request.password, user.hashed_password):
        return {'message': 'Invalid password'}

    access_token = authentication_handler.encode_token(user.username)
    refreshed_token = authentication_handler.encode_refresh_token(user.username)

    return {
        'access_token': access_token,
        'refresh_token': refreshed_token
    }


@router.get('/refresh_token')
async def refresh_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    refreshed_token = credentials.credentials
    new_token = authentication_handler.decode_refresh_token(refreshed_token)

    return {'access_token': new_token}


@router.delete('/{username}', dependencies=[Depends(security)])
async def delete_user(username: str, db: Session = Depends(get_db)):
    crud.delete_user(db=db, username=username)

    return {'message': 'Success'}
