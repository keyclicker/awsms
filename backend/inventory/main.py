from fastapi import FastAPI

import database
import router

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
app.include_router(router.router, prefix='/goods')
