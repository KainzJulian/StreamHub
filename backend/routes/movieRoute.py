import os
from PIL import Image
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from utils.save_to_db import uploadMoviesToDB
from utils.get_thumbnail_paths import getThumbnailPaths
from utils.get_env import getENV
from database import movieCollection
from classes.movie import Movie
from classes.response import Response

movieRouter = APIRouter(prefix="/movies", tags=["movie"])

moviesPath = getENV("MEDIA_PATH") + "/movies"
mediaPath = getENV("MEDIA_PATH")


@movieRouter.get("/")
def getAllMovies() -> Response[list[Movie]]:
    try:
        uploadMoviesToDB(moviesPath)

        movieList = list(
            movieCollection.find({}, {"_id": False, "id": True, "mediaPath": True})
        )

        for movie in movieList:
            if not os.path.exists(mediaPath + "/" + movie["mediaPath"]):
                removeMovie(movie["id"])

        movieList = list(movieCollection.find({}, {"_id": False}))

        return Response.Success(movieList)

    except Exception as e:
        raise e
        return Response.Error(e)


@movieRouter.get("/{movie_id}/movie")
def getMovieByID(movie_id: str) -> Response[Movie]:

    try:
        movie = movieCollection.find_one({"id": movie_id}, {"_id": False})
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


@movieRouter.get("/{movie_id}/thumbnail_banner")
def getThumbnailBanner(movie_id: str):

    try:
        movie = movieCollection.find_one({"id": movie_id}, {"mediaPath": True})

        if movie == None:
            raise HTTPException(
                status_code=404, detail="No Movie with the ID: " + movie_id
            )

        thumbnail = getThumbnailPaths(movie["mediaPath"], mediaPath)

        if not os.path.exists(thumbnail[0]):
            return None

        response = FileResponse(thumbnail[0], media_type="image/jpeg")
        return response

    except Exception as e:
        return Response.Error(e)


@movieRouter.get("/{movie_id}/thumbnail_preview")
def getThumbnailPreview(movie_id: str):

    try:
        movie = movieCollection.find_one({"id": movie_id}, {"mediaPath": True})

        if movie == None:
            raise HTTPException(
                status_code=404, detail="No Movie with the ID: " + movie_id
            )

        thumbnail = getThumbnailPaths(movie["mediaPath"], mediaPath)

        originalThumbnailPath = thumbnail[0]
        previewThumbnailPath = thumbnail[1]

        if os.path.exists(previewThumbnailPath):
            return FileResponse(previewThumbnailPath, media_type="image/jpeg")

        if not os.path.exists(originalThumbnailPath):
            return None

        image = Image.open(originalThumbnailPath)
        image.thumbnail((400, 600))
        image.save(previewThumbnailPath)

        response = FileResponse(previewThumbnailPath, media_type="image/jpeg")
        return response
    except Exception as e:
        return Response.Error(e)


@movieRouter.get("/{movie_id}/video")
def getVideo(movie_id: str):
    return {"movie_id": movie_id, "video": "video_url"}


@movieRouter.get("/{movie_id}/percent_watched")
def getPercentWatched(movie_id: str) -> Response[int]:

    try:
        movie = movieCollection.find_one({"id": movie_id}, {"_id": False})

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

    pipeline = [{"$sample": {"size": count}}, {"$project": {"_id": False}}]

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
        movieList = list(
            movieCollection.find(
                {"title": {"$regex": query, "$options": "i"}}, {"_id": False}
            )
        )
        return Response.Success(movieList)

    except Exception as e:
        return Response.Error(e)


def removeMovie(id: str):

    try:
        movieCollection.find_one_and_delete({"id": id})
    except Exception as e:
        raise e
