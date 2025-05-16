from asyncio.windows_events import INFINITE
import datetime
import time
from fastapi import APIRouter
import pymongo

from classes.episode import Episode
from classes.movie import Movie
from routes.mediaRoute import getMediaById
from classes.media import Media
from classes.watch_history import HistoryItem
from classes.response import Response
from database import watchHistoryCollection

watchHistoryRouter = APIRouter(prefix="/watch_history", tags=["watchHistory"])


@watchHistoryRouter.get("/{limit}")
def getWatchHistory(limit: int) -> Response[list[Episode | Movie]]:

    mediaList = []

    try:

        history = list(
            watchHistoryCollection.find({}, {"_id": False})
            .limit(limit)
            .sort("time", pymongo.DESCENDING)
        )

        for item in history:
            mediaList.append(getMediaById(item["id"]).data)

        print(mediaList)

        return Response.Success(mediaList)

    except Exception as e:
        return Response.Error(e)


@watchHistoryRouter.post("/add/{media_id}")
def addToWatchHistory(media_id: str, media_type: str) -> Response[bool]:

    try:
        historyItem = HistoryItem(
            id=media_id, type=media_type, time=datetime.datetime.now()
        )
        watchHistoryCollection.insert_one(historyItem.model_dump())
        return Response.Success(True)

    except Exception as e:
        return Response.Error(e)
