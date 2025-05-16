import math
from random import choice
from fastapi import APIRouter, HTTPException
from pymongo import DESCENDING

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
            print(media)
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
        print(mediaList)

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


def mergeMovieSeriesLists(
    movieList: list[Movie], seriesList: list[Series]
) -> list[Media]:
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
