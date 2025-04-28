import os
from fastapi import APIRouter
from utils.get_env import getENV
from database import movieCollection
from classes.movie import Movie
from classes.response import Response

movieRouter = APIRouter(prefix="/movies", tags=["movie"])


@movieRouter.get("/")
def getAllMovies() -> Response[list[Movie]]:
    try:
        movieList = list(movieCollection.find({}, {"_id": 0}))
        return Response.Success(movieList)

    except Exception as e:
        return Response.Error(e)


@movieRouter.get("/{movie_id}/movie")
def getMovieByID(movie_id: str) -> Response[Movie]:

    try:
        movie = movieCollection.find_one({"id": movie_id}, {"_id": 0})
        return Response.Success(movie)

    except Exception as e:
        return Response.Error(e)


@movieRouter.get("/{movie_id}/exists")
def exists(movie_id: str) -> Response[bool]:
    try:
        movie = movieCollection.find_one({"id": movie_id})
        if movie != None:
            return Response.Success(True)

    except Exception as e:
        Response.Error(e)

    return Response.Success(False)


@movieRouter.get("/{movie_id}/thumbnail")
def getThumbnail(movie_id: str):

    # TODO Thumbnail zurück schicken
    # TODO variablen für ENV anlegen damit man nicht immer getENV machen muss

    movie = movieCollection.find_one({"id": movie_id}, {"thumbnailPath": True})

    response = None

    if movie != None:
        response = getENV("MEDIA_PATH") + "/" + movie["thumbnailPath"]

    return Response.Success(response)


@movieRouter.get("/{movie_id}/video")
def getVideo(movie_id: str):
    return {"movie_id": movie_id, "video": "video_url"}


@movieRouter.get("/{movie_id}/percent_watched")
def getPercentWatched(movie_id: str) -> Response[int]:

    try:
        movie = movieCollection.find_one({"id": movie_id}, {"_id": 0})

        if movie == None:
            return Response.Error(Exception("No Movie found with the ID: " + movie_id))

        percent = int(movie["durationWatched"] / movie["duration"] * 100)

        return Response.Success(percent)
    except Exception as e:
        return Response.Error(e)


@movieRouter.post("{movie_id}/rate")
def setRating(movie_id: str, rating: int) -> Response[str]:

    if rating > 100 or rating < 0:
        return Response.Error(
            Exception(
                "Error: The Rating has to be between 0 and 100 Provided rating: "
                + str(rating)
            )
        )

    try:
        movieCollection.find_one_and_update(
            {"id": movie_id}, {"$set": {"rating": rating}}
        )
        return Response.Success(
            f"Updated Rating of Movie: {movie_id} New Rating: {rating}"
        )
    except Exception as e:
        return Response.Error(e)


@movieRouter.get("/random/{count}")
def getRandomMovies(count: int):

    pipeline = [{"$sample": {"size": count}}, {"$project": {"_id": 0}}]

    try:
        movieList = list(movieCollection.aggregate(pipeline))

        return Response.Success(movieList)

    except Exception as e:
        return Response.Error(e)


@movieRouter.post("/add")
def addMovie(movie: Movie):
    try:
        movieCollection.insert_one(movie.model_dump())
        return Response.Success("Added Movie to the Collection")

    except Exception as e:
        return Response.Error(e)


@movieRouter.get("/search/{query}")
def searchMovies(query: str) -> Response[list[Movie]]:

    try:
        seriesList = list(
            movieCollection.find(
                {"title": {"$regex": query, "$options": "i"}}, {"_id": 0}
            )
        )
        return Response.Success(seriesList)

    except Exception as e:
        return Response.Error(e)
