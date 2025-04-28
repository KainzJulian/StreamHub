from uuid import uuid5
from fastapi import APIRouter, UploadFile, File, HTTPException

from classes.response import Response
from database import seriesCollection
from classes.series import Series

seriesRouter = APIRouter(prefix="/series", tags=["series"])


@seriesRouter.get("/{series_id}/exists")
def exists(series_id: str) -> Response[bool]:

    try:
        series = seriesCollection.find_one({"id": series_id})

        if series == None:
            return Response.Success(False)

    except Exception as e:
        Response.Error(e)

    return Response.Success(True)


@seriesRouter.post("/add")
def addSeries(series: Series) -> Response[str]:
    try:
        seriesCollection.insert_one(series.model_dump())
        return Response.Success("Added Series: " + series.title)

    except Exception as e:
        return Response.Error(e)


@seriesRouter.get("/{series_id}/data")
def getSeriesByID(series_id: str) -> Response[Series]:

    try:
        series = seriesCollection.find_one({"id": series_id}, {"_id": 0})
        return Response.Success(series)

    except Exception as e:
        return Response.Error(e)


@seriesRouter.get("/")
def getAllSeries():
    try:
        seriesList = list(seriesCollection.find({}, {"_id": 0}))
        return Response.Success(seriesList)

    except Exception as e:
        return Response.Error(e)


@seriesRouter.get("/random/{count}")
def getRandomSeries(count: int):
    pipeline = [{"$sample": {"size": count}}, {"$project": {"_id": 0}}]

    try:
        seriesList = list(seriesCollection.aggregate(pipeline))
        return Response.Success(seriesList)

    except Exception as e:
        return Response.Error(e)


# get the average percentage watched of each episode
@seriesRouter.get("/percent_watched/{series_id}")
def getPercentWatched(series_id: str) -> Response[int]:
    try:
        series = seriesCollection.find_one({"id": series_id}, {"_id": 0})

        if series == None:
            return Response.Error(
                Exception("No Series found with the ID: " + series_id)
            )

        percent = int(series["durationWatched"] / series["duration"] * 100)

        return Response.Success(percent)

    except Exception as e:
        return Response.Error(e)


@seriesRouter.get("/thumbnail/{series_id}")
def getThumbnail(series_id: str):
    return {"series_id": series_id, "thumbnail": "thumbnail_url"}


@seriesRouter.get("/search/{query}")
def searchSeries(query: str) -> Response[list[Series]]:
    try:
        seriesList = list(
            seriesCollection.find(
                {"title": {"$regex": query, "$options": "i"}}, {"_id": 0}
            )
        )
        return Response.Success(seriesList)

    except Exception as e:
        return Response.Error(e)


@seriesRouter.post("{series_id}/rate")
def setRating(series_id: str, rating: int) -> Response[str]:

    if rating > 100 or rating < 0:
        return Response.Error(
            Exception(
                "Error: The Rating has to be between 0 and 100 Provided rating: "
                + str(rating)
            )
        )

    try:
        seriesCollection.find_one_and_update(
            {"id": series_id}, {"$set": {"rating": rating}}
        )
        return Response.Success(
            f"Updated Rating of Series: {series_id} New Rating: {rating}"
        )
    except Exception as e:
        return Response.Error(e)
