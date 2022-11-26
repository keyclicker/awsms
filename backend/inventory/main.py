from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis_om import get_redis_connection, HashModel

import config
import router

config.Base.metadata.create_all(bind=config.engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(router.router, prefix='/product', tags=['product'])

redis = get_redis_connection(
    host='redis-16799.c293.eu-central-1-1.ec2.cloud.redislabs.com',
    port=16799,
    password='cALu8Gy1NFs88QL7R5jUDUL6U6SfVNwj',
    decode_responses=True
)
