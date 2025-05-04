from asyncio.windows_events import INFINITE
import datetime
import time
from fastapi import APIRouter
import pymongo

from classes.watch_history import HistoryItem
from classes.response import Response
from database import watchHistoryCollection

watchHistoryRouter = APIRouter(prefix="/watch_history", tags=["watchHistory"])


@watchHistoryRouter.get("/")
def getWatchHistory(limit: int) -> Response:

    try:
        if limit < 0:
            limit = 0

        history = list(
            watchHistoryCollection.find({}, {"_id": False})
            .limit(limit)
            .sort("time", pymongo.DESCENDING)
        )
        return Response.Success(history)

    except Exception as e:
        return Response.Error(e)


@watchHistoryRouter.post("/add/{media_id}")
def addToWatchHistory(media_id: str, media_type: str) -> Response:

    try:
        historyItem = HistoryItem(
            id=media_id, type=media_type, time=datetime.datetime.now()
        )
        watchHistoryCollection.insert_one(historyItem.model_dump())
        return Response.Success(True)

    except Exception as e:
        return Response.Error(e)
