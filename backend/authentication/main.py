from fastapi import FastAPI, HTTPException
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from starlette import status

import jwt
import database
import schemas
import auth
import crud

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

reusable_oauth = OAuth2PasswordBearer(tokenUrl="/users/login", scheme_name="JWT")


def get_db():
    db = database.SessionLocal()

    try:
        yield db
    finally:
        db.close()


async def get_current_user(token: str = Depends(reusable_oauth), db: Session = Depends(get_db)):
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

    user = crud.get_user_by_username(db, token_payload.subject)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Could not find user',
        )

    return user


@app.post('/users/signup', response_model=schemas.User)
async def signup(auth_data: schemas.UserAuth, db: Session = Depends(get_db)):
    if crud.get_user_by_username(db, auth_data.username) is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='User with this username already exist'
        )

    user_schema = schemas.User(
        username=auth_data.username,
        hashed_password=auth.hash_password(auth_data.password)
    )

    return crud.create_user(db, user_schema)


@app.post('/users/login', response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, form_data.username)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Incorrect email or password'
        )

    if not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Incorrect email or password'
        )

    return schemas.Token(
        access_token=auth.create_access_token(user.username),
        refresh_token=auth.create_refresh_token(user.username)
    )


@app.get('/users/me', response_model=schemas.User)
async def get_me(user: schemas.User = Depends(get_current_user)):
    return user
