import math
from random import choice
from typing import TypedDict
from fastapi import APIRouter, HTTPException
from pymongo import DESCENDING

from routes import seriesRoute
from routes import movieRoute
from classes.episode import Episode
from classes.movie import Movie
from classes.series import Series
from classes.media import Media
from classes.response import Response

from database import movieCollection
from database import episodesCollection
from database import seriesCollection

from routes.movieRoute import getRandomMovies
from routes.seriesRoute import getRandomSeries


mediaRouter = APIRouter(prefix="/media", tags=["media"])


@mediaRouter.get("/get/{media_id}")
def getMediaById(media_id: str) -> Response[Movie | Series | Episode]:
    try:

        media = episodesCollection.find_one({"id": media_id}, {"_id": False})
        if media:
            return Response.Success(media)

        media = movieCollection.find_one({"id": media_id}, {"_id": False})
        if media:
            return Response.Success(media)

        media = seriesCollection.find_one({"id": media_id}, {"_id": False})
        if media:
            return Response.Success(media)

        raise HTTPException(status_code=404, detail="Media not found")

    except Exception as e:
        return Response.Error(e)


@mediaRouter.get("/highest_rated")
def getHighestRatedMediaIDs(limit: int) -> Response[list[Series | Movie]]:

    mediaList = []

    try:

        seriesList = (
            seriesCollection.find({}, {"_id": False})
            .sort("rating", DESCENDING)
            .limit(limit)
            .to_list()
        )

        movieList = (
            movieCollection.find({}, {"_id": False})
            .sort("rating", DESCENDING)
            .limit(limit)
            .to_list()
        )

        mediaList = seriesList + movieList

        mediaList.sort(key=lambda x: x["rating"] or 0, reverse=True)

        return Response.Success(mediaList)

    except Exception as e:
        return Response.Error(e)


@mediaRouter.get("/random_media/{limit}")
def getRandomMedia(limit: int) -> Response[list[Media]]:

    seriesLimit = math.floor(limit / 2)
    moviesLimit = math.ceil(limit / 2)

    try:

        movies = getRandomMovies(moviesLimit).data
        series = getRandomSeries(seriesLimit).data

        if not movies and not series:
            raise HTTPException(status_code=404, detail="No Movies or Series found")

        if not movies:
            return Response.Success(series)

        if not series:
            return Response.Success(movies)

        return Response.Success(mergeMovieSeriesLists(movies, series))

    except Exception as e:
        return Response.Error(e)


@mediaRouter.post("/search/{query}")
def search(query: str, genres: list[str]) -> Response[list[Series | Movie]]:

    print(query)
    print(genres)

    try:

        series = seriesRoute.searchSeries(query, genres).data
        movies = movieRoute.searchMovies(query, genres).data

        if not series:
            series = []

        if not movies:
            movies = []

        mediaList = series + movies

        return Response.Success(mediaList)

    except Exception as e:
        return Response.Error(e)


def mergeMovieSeriesLists(
    movieList: list[Movie], seriesList: list[Series]
) -> list[Movie | Series]:
    result = []

    turn = choice([0, 1])

    cycles = 0

    while len(movieList) > 0 or len(seriesList) > 0:
        cycles += 1

        if turn == 0 and len(movieList) > 0:
            result.append(movieList.pop(0))

        if turn == 1 and len(seriesList) > 0:
            result.append(seriesList.pop(0))

        turn = choice([0, 1])

        if len(movieList) <= 0:
            turn = 1

        if len(seriesList) <= 0:
            turn = 0

    return result


@mediaRouter.post("/{media_id}/time")
def updateTimeWatched(media_id: str, time_in_seconds: int) -> Response[bool]:
    try:

        media = episodesCollection.find_one_and_update(
            {"id": media_id}, {"$set": {"durationWatched": time_in_seconds}}
        )

        if media == None:
            media = movieCollection.find_one_and_update(
                {"id": media_id}, {"$set": {"durationWatched": time_in_seconds}}
            )

        if media == None:
            return Response.Error(Exception("No media with the id found: " + media_id))

        if media["duration"] * 0.9 <= time_in_seconds:
            setWatchedFlag(media_id)

        return Response.Success(True)

    except Exception as e:
        return Response.Error(e)


@mediaRouter.post("/{media_id}/watched")
def setWatchedFlag(media_id: str) -> Response[bool]:
    try:

        episode = episodesCollection.find_one({"id": media_id}, {"watched": True})

        media = episodesCollection.find_one_and_update(
            {"id": media_id}, {"$set": {"watched": True, "durationWatched": 0}}
        )

        if media != None and episode != None and episode["watched"] != True:
            seriesRoute.updateDurationWatched(media["seriesID"])

        if media == None:
            media = movieCollection.find_one_and_update(
                {"id": media_id}, {"$set": {"watched": True, "durationWatched": 0}}
            )

        if media == None:
            return Response.Error(Exception("No media with the id found: " + media_id))

        return Response.Success(True)
    except Exception as e:
        return Response.Error(e)


@mediaRouter.get("/{media_id}/time_watched")
def getTimeWatched(media_id: str) -> Response[int]:
    try:

        media = episodesCollection.find_one({"id": media_id}, {"durationWatched": True})

        if media == None:
            media = movieCollection.find_one(
                {"id": media_id}, {"durationWatched": True}
            )

        time = 0

        if media != None:
            time = media["durationWatched"]

        return Response.Success(time)

    except Exception as e:
        return Response.Error(e)


@mediaRouter.put("/{media_id}/data")
def updateData(media_id: str, media: Media) -> Response[bool]:

    pipelineSet = {
        "$set": {
            "title": media.title,
            "description": media.description,
            "genreList": media.genreList,
            "isComplete": media.isComplete,
            "rating": media.rating,
        }
    }

    if media.type == "Episode":
        pipelineSet = {
            "$set": {
                "title": media.title,
                "description": media.description,
                "isComplete": media.isComplete,
                "rating": media.rating,
            }
        }

    try:

        updatedDocument: bool = False

        if media.type == "Episode":

            episode = episodesCollection.find_one({"id": media_id}, {"seriesID": True})

            print(episode)

            if episode == None:
                raise Exception("Episode is not linked to Series")

            episodesCollection.update_one({"id": media_id}, pipelineSet)
            seriesCollection.update_one(
                {"id": episode["seriesID"]}, {"$set": {"genreList": media.genreList}}
            )

            updatedDocument = True

        if media.type == "Series":
            seriesCollection.update_one({"id": media_id}, pipelineSet)
            updatedDocument = True

        if media.type == "Movie":
            movieCollection.update_one({"id": media_id}, pipelineSet)
            updatedDocument = True

        return Response.Success(updatedDocument)
    except Exception as e:
        return Response.Error(e)
