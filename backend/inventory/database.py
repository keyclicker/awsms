from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from redis_om import get_redis_connection

HOST = 'localhost'
PORT = 5432
POSTGRES_USER = 'postgres'
POSTGRES_PASSWORD = 'admin'
POSTGRES_DATABASE = 'awsms_inventory'

SQLALCHEMY_DATABASE_URL = f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{HOST}:{PORT}/{POSTGRES_DATABASE}'

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Lightweight analog of RabbitMQ
redis = get_redis_connection(
    host='redis-16799.c293.eu-central-1-1.ec2.cloud.redislabs.com',
    port=16799,
    password='cALu8Gy1NFs88QL7R5jUDUL6U6SfVNwj',
    encoding='latin-1',
    decode_responses=True
)


def get_session():
    session = SessionLocal()

    try:
        yield session
    finally:
        session.close()
