from fastapi import FastAPI, HTTPException
from fastapi.params import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from starlette import status
from starlette.middleware.cors import CORSMiddleware
from app import database, schemas, auth, crud

import jwt

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_methods=['*'],
    allow_headers=['*']
)

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(database.get_session),
):
    token = credentials.credentials

    try:
        token_payload = auth.decode_access_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Token expired',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Could not validate credentials',
            headers={'WWW-Authenticate': 'Bearer'}
        )

    user = crud.get_user_by_username(session, token_payload.subject)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Could not find user',
        )

    return user


@app.post('/signup', response_model=schemas.User)
async def signup(data: schemas.UserCreate, session: Session = Depends(database.get_session)):
    if crud.get_user_by_username(session, data.username) is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='User with this username already exist'
        )

    user_schema = schemas.User(
        username=data.username,
        full_name=data.full_name,
        hashed_password=auth.hash_password(data.password)
    )

    return crud.create_user(session, user_schema)


async def authenticate_user(username: str, password: str, session: Session):
    user = crud.get_user_by_username(session, username)

    if user is None or not auth.verify_password(password, user.hashed_password):
        return None

    return user


@app.post('/login', response_model=schemas.Token)
async def login(data: schemas.UserAuth, session: Session = Depends(database.get_session)):
    username = data.username
    password = data.password

    user = await authenticate_user(username=username, password=password, session=session)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Incorrect email or password',
            headers={'WWW-Authenticate': 'Bearer'}
        )

    access_token = auth.create_access_token(username)
    refresh_token = auth.create_refresh_token(username)

    return JSONResponse(content={
        'access_token': access_token,
        'refresh_token': refresh_token
    })


@app.post('/logout', dependencies=[Depends(get_current_user)])
async def logout():
    # TODO: delete access_token
    response = JSONResponse(content={})
    response.delete_cookie(key='access_token')
    response.delete_cookie(key='refresh_token')

    return response


@app.post('/me', response_model=schemas.User)
async def get_me(user: schemas.User = Depends(get_current_user)):
    return user
