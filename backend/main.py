from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils import loadFiles
from routes.fileRoute import fileRouter
import pymongo

from utils.get_env import getENV

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_event_handler("startup", loadFiles)

print("Docs: http://127.0.0.1:8000/docs#/")

routes = [fileRouter]

for route in routes:
    app.include_router(route, prefix="/api")


import database
