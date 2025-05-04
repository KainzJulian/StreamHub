from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.watchHistoryRoute import watchHistoryRouter
from utils import saveFilesToDB
from routes.seriesRoute import seriesRouter
from routes.episodeRoute import episodeRouter
from routes.movieRoute import movieRouter
from routes.currentMediaRoute import currentMediaRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_event_handler("startup", saveFilesToDB)

print("Docs: http://127.0.0.1:8000/docs#/")

routes = [
    seriesRouter,
    episodeRouter,
    movieRouter,
    currentMediaRouter,
    watchHistoryRouter,
]

for route in routes:
    app.include_router(route, prefix="/api")


import database
