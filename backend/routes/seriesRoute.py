from uuid import uuid5
from fastapi import APIRouter, UploadFile, File, HTTPException

from database import seriesCollection
from classes.series import Series

seriesRouter = APIRouter(prefix="/series")


@seriesRouter.get("/{series_id}/exists")
def exists(series_id: str):

    try:
        series = seriesCollection.find_one({"id": series_id})

        if series == None:
            return False

    except Exception as e:
        print(e)

    return True


@seriesRouter.post("/add")
def addSeries(series: Series):
    try:
        seriesCollection.insert_one(series.model_dump())
    except Exception as e:
        print(e)


@seriesRouter.get("/{series_id}")
def getSeriesByID(series_id: str):
    return {"id": series_id}


@seriesRouter.get("/all")
def getAllSeries():
    return {"series": []}


@seriesRouter.get("/random/{count}")
def getRandomSeries(count: int):
    return {"series": []}


# get the average percentage watched of each episode
@seriesRouter.get("/percent_watched/{series_id}")
def getPercentWatched(series_id: str):
    return {"series_id": series_id, "percent_watched": 90.0}


@seriesRouter.get("/thumbnail/{series_id}")
def getThumbnail(series_id: str):
    return {"series_id": series_id, "thumbnail": "thumbnail_url"}


@seriesRouter.get("/search/{query}")
def searchSeries(query: str):
    return {"query": query, "series": []}
