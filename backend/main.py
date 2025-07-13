from dotenv import find_dotenv, load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from regex import T
from utils.get_env import getENV
from routes.watchHistoryRoute import watchHistoryRouter
from utils import saveFilesToDB
from routes.seriesRoute import seriesRouter
from routes.episodeRoute import episodeRouter
from routes.movieRoute import movieRouter
from routes.currentMediaRoute import currentMediaRouter
from routes.mediaRoute import mediaRouter

load_dotenv(find_dotenv(".env"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

instantiateDataOnStartup = getENV("INSTANTIATE_DATA_ON_START_UP")

if instantiateDataOnStartup == "true":
    app.add_event_handler("startup", saveFilesToDB)

print("Docs: http://127.0.0.1:8000/docs#/")

routes = [
    seriesRouter,
    episodeRouter,
    movieRouter,
    currentMediaRouter,
    watchHistoryRouter,
    mediaRouter,
]

for route in routes:
    app.include_router(route, prefix="/api")


import database
