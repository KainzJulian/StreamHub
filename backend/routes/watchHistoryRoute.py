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
            data = getMediaById(item["id"]).data
            if data == None:
                removeFromWatchHistory(item["id"])
                continue

            mediaList.append(data)

        print(mediaList)

        return Response.Success(mediaList)

    except Exception as e:
        # raise e
        return Response.Error(e)


def removeFromWatchHistory(media_id: str):
    try:
        watchHistoryCollection.find_one_and_delete({"id": media_id})
    except Exception as e:
        raise e


@watchHistoryRouter.post("/add/{media_id}")
def addToWatchHistory(media_id: str, media_type: str) -> Response[bool]:

    print("Added to watchHistory: " + media_id + " with type: " + media_type)

    try:

        id = getLastWatchedMediaID()

        if id == media_id:
            return Response.Success(False)

        historyItem = HistoryItem(
            id=media_id, type=media_type, time=datetime.datetime.now()
        )

        print(historyItem)

        watchHistoryCollection.insert_one(historyItem.model_dump())
        return Response.Success(True)

    except Exception as e:
        return Response.Error(e)


def getLastWatchedMediaID():

    lastWatchedItem = getWatchHistory(1).data

    if lastWatchedItem != None and lastWatchedItem != []:

        if lastWatchedItem[0] == None:
            return ""

        if isinstance(lastWatchedItem[0], dict):
            return lastWatchedItem[0]["id"]
        else:
            return lastWatchedItem[0].id
