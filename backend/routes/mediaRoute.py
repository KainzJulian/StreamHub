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
