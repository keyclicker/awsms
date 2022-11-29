from fastapi import FastAPI

import config
import router

config.Base.metadata.create_all(bind=config.engine)

app = FastAPI()
app.include_router(router.router, prefix='/user', tags=['user'])
