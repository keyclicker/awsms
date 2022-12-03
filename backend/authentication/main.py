from fastapi import FastAPI, HTTPException
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.responses import JSONResponse, Response, RedirectResponse
from sqlalchemy.orm import Session
from starlette import status

import jwt
import database
import schemas
import auth
import crud

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/users/login", scheme_name="JWT")


async def get_current_user(token: str = Depends(oauth2_schema), session: Session = Depends(database.get_session)):
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


@app.post('/users/signup', response_model=schemas.User)
async def signup(auth_data: schemas.UserAuth, session: Session = Depends(database.get_session)):
    if crud.get_user_by_username(session, auth_data.username) is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='User with this username already exist'
        )

    user_schema = schemas.User(
        username=auth_data.username,
        hashed_password=auth.hash_password(auth_data.password)
    )

    return crud.create_user(session, user_schema)


async def authenticate_user(username: str, password: str, session: Session):
    user = crud.get_user_by_username(session, username)

    if user is None or not auth.verify_password(password, user.hashed_password):
        return None

    return user


@app.post('/users/login', response_model=schemas.Token)
async def login(request_form: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(database.get_session)):
    username = request_form.username
    password = request_form.password

    user = await authenticate_user(username=username, password=password, session=session)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Incorrect email or password',
            headers={'WWW-Authenticate': 'Bearer'}
        )

    access_token = auth.create_access_token(username)
    refresh_token = auth.create_refresh_token(username)

    response = JSONResponse(content={
        'access_token': access_token,
        'refresh_token': refresh_token
    })

    response.set_cookie(key='access_token', value=access_token)
    response.set_cookie(key='refresh_token', value=refresh_token)

    return response


@app.get('/users/logout', dependencies=[Depends(get_current_user)])
async def logout():
    response = JSONResponse(content={})
    response.delete_cookie(key='access_token')
    response.delete_cookie(key='refresh_token')

    return response


@app.get('/users/me', response_model=schemas.User)
async def get_me(user: schemas.User = Depends(get_current_user)):
    return user
