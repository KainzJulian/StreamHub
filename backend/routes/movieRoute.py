import os
from uuid import uuid5
import uuid
from PIL import Image
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse, StreamingResponse
from pymongo import DESCENDING
from utils.save_to_db import uploadMoviesToDB
from utils.get_thumbnail_paths import getThumbnailPaths
from utils.get_env import getENV
from database import movieCollection
from classes.movie import Movie
from classes.response import Response

movieRouter = APIRouter(prefix="/movies", tags=["movie"])

moviesPath = getENV("MEDIA_PATH") + "/movies"
mediaPath = getENV("MEDIA_PATH")
removeOrphanedMedia = getENV("REMOVE_ORPHANED_MEDIA")


@movieRouter.get("/")
def getAllMovies() -> Response[list[Movie]]:
    try:
        movieList = list(
            movieCollection.find({}, {"_id": False, "id": True, "mediaPath": True})
        )

        for movie in movieList:
            if not os.path.exists(mediaPath + "/" + movie["mediaPath"]):
                removeMovie(movie["id"])

        movieList = list(movieCollection.find({}, {"_id": False}))

        return Response.Success(movieList)

    except Exception as e:
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

        response = FileResponse(
            thumbnail[0],
            media_type="image/jpeg",
            headers={"Cache-Control": "no-store, must-revalidate"},
        )
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
            return FileResponse(
                previewThumbnailPath,
                media_type="image/jpeg",
                headers={"Cache-Control": "no-store, must-revalidate"},
            )

        if not os.path.exists(originalThumbnailPath):
            return None

        image = Image.open(originalThumbnailPath)
        image.thumbnail((350, 500))
        image.save(previewThumbnailPath, quality=60)

        response = FileResponse(
            previewThumbnailPath,
            media_type="image/jpeg",
            headers={"Cache-Control": "no-store, must-revalidate"},
        )
        return response
    except Exception as e:
        return Response.Error(e)


def getByteRange(range_header: str, file_size: int):
    try:
        range_val = range_header.strip().lower().replace("bytes=", "")
        start, end = range_val.split("-")
        start = int(start)
        end = int(end) if end else file_size - 1
        return start, end
    except Exception:
        return None, None


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
def getRandomMovies(count: int) -> Response[list[Movie]]:

    if count == 0:
        pipeline = [{"$project": {"_id": False}}]
    else:
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
def searchMovies(query: str, genres: list[str]) -> Response[list[Movie]]:

    pipe = {"title": {"$regex": query, "$options": "i"}}

    if genres != []:
        pipe = {
            "title": {"$regex": query, "$options": "i"},
            "genreList": {"$all": genres},
        }

    try:
        movieList = list(
            movieCollection.find(
                pipe,
                {"_id": False},
            )
        )
        return Response.Success(movieList)

    except Exception as e:
        return Response.Error(e)


def removeMovie(id: str):

    if removeOrphanedMedia == "false":
        return

    try:
        movieCollection.find_one_and_delete({"id": id})
    except Exception as e:
        raise e


@movieRouter.get("/highest_rated/{limit}")
def getHighestRatedMovies(limit: int) -> Response[list[Movie]]:
    try:
        movies = list(
            movieCollection.find({}, {"_id": False})
            .sort("rating", DESCENDING)
            .limit(limit)
        )
        return Response.Success(movies)

    except Exception as e:
        return Response.Error(e)


@movieRouter.get("/{movie_id}/similar")
def getSimilarMovies(movie_id: str) -> Response[list[Movie]]:

    movies: list[Movie] = []

    try:

        movie = movieCollection.find_one(
            {"id": movie_id}, {"_id": False, "mediaPath": True}
        )

        if movie == None:
            return Response.Error(
                Exception("No Movie with provided ID found: " + movie_id)
            )

        folderPath = moviesPath + "/" + movie["mediaPath"].split("/")[-2]

        files: list[str] = []

        for filename in os.listdir(folderPath):
            if filename.endswith(".mp4"):
                files.append(
                    os.path.join(folderPath, filename)
                    .replace("\\", "/")
                    .split("/")[-3:]
                )

        ids: list[str] = []

        for file in files:
            id = uuid5(
                uuid.NAMESPACE_DNS,
                file[0] + "/" + file[1] + "/" + os.path.splitext(file[-1])[0],
            )

            ids.append(str(id))

        movies: list[Movie] = []

        for id in ids:

            help = movieCollection.find_one({"id": id}, {"_id": False})

            if help == None:
                return Response.Error(Exception("ID not found: " + id))

            movies.append(help)

        return Response.Success(movies)

    except Exception as e:
        return Response.Error(e)
