from fastapi import APIRouter, Depends, HTTPException
from classes.movie import Movie

movieRouter = APIRouter(prefix="/movie", tags=["movie"])


@movieRouter.get("/{movie_id}")
def getMovieByID(movie_id: str):
    return {"id": movie_id}


@movieRouter.get("/all", tags=["movie"])
def getAllMovies():
    return {"movies": []}


@movieRouter.get("/random/{count}")
def getRandomMovies(count: int):
    return {"movies": []}


@movieRouter.get("/thumbnail/{movie_id}")
def getThumbnail(movie_id: str):
    return {"movie_id": movie_id, "thumbnail": "thumbnail_url"}


@movieRouter.get("/video/{movie_id}")
def getVideo(movie_id: str):
    return {"movie_id": movie_id, "video": "video_url"}


@movieRouter.get("/percent_watched/{movie_id}")
def getPercentWatched(movie_id: str):
    return {"movie_id": movie_id, "percent_watched": 0.0}


@movieRouter.post("/add")
def addMovie(movie: Movie):
    return {"movie": movie}


@movieRouter.get("/search/{query}")
def searchMovies(query: str):
    return {"query": query, "movies": []}
