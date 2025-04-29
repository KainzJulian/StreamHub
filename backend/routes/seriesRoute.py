from ast import Str
import os
import time
from uuid import uuid5
from PIL import Image
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from utils.get_env import getENV
from classes.response import Response
from database import seriesCollection
from classes.series import Series

seriesRouter = APIRouter(prefix="/series", tags=["series"])


seriesPath = getENV("MEDIA_PATH") + "/series"


@seriesRouter.get("/")
def getAllSeries():
    try:
        seriesList = list(seriesCollection.find({}, {"_id": 0}))
        return Response.Success(seriesList)

    except Exception as e:
        return Response.Error(e)


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
        seriesCollection.insert_one(series.model_dump(exclude={"episodeList"}))
        return Response.Success("Added Series: " + str(series.title))

    except Exception as e:
        return Response.Error(e)


@seriesRouter.get("/{series_id}/series")
def getSeriesWithEpisodesByID(series_id: str) -> Response[Series]:

    pipeline = [
        {"$match": {"id": series_id}},
        {
            "$lookup": {
                "from": "episodes",
                "localField": "id",
                "foreignField": "seriesID",
                "as": "episodeList",
            }
        },
        {"$project": {"_id": False, "episodeList._id": False}},
    ]

    try:

        seriesCursor = seriesCollection.aggregate(pipeline)
        series = next(seriesCursor, None)

        if series == None:
            return Response.Error(
                Exception("No Series found with the ID: " + series_id)
            )

        # series = seriesCollection.find_one({"id": series_id}, {"_id": 0})
        return Response.Success(series)

    except Exception as e:
        return Response.Error(e)


# get the average percentage watched of each episode
@seriesRouter.get("/{series_id}/percent_watched")
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


@seriesRouter.get("/{series_id}/thumbnail_banner")
def getThumbnailBanner(series_id: str):

    try:
        series = seriesCollection.find_one({"id": series_id}, {"thumbnailPath": True})

        if series == None:
            raise HTTPException(
                status_code=404, detail="No Series with the ID: " + series_id
            )

        thumbnailPath = f"{seriesPath}/{series["thumbnailPath"]}"

        if not os.path.exists(thumbnailPath):
            raise HTTPException(status_code=404, detail="Thumbnail not found")

        response = FileResponse(thumbnailPath, media_type="image/jpeg")
        return response

    except Exception as e:
        return Response.Error(e)


@seriesRouter.get("/{series_id}/thumbnail_preview")
def getThumbnail(series_id: str):

    try:
        series = seriesCollection.find_one(
            {"id": series_id}, {"thumbnailPath": True, "title": True}
        )

        if series == None:
            raise HTTPException(
                status_code=404, detail="No Series with the ID: " + series_id
            )

        originalThumbnailPath = f"{seriesPath}/{series["thumbnailPath"]}"
        previewThumbnailPath = f"{seriesPath}/{series["title"]}_preview.jpg"

        if os.path.exists(previewThumbnailPath):
            return FileResponse(previewThumbnailPath, media_type="image/jpeg")

        if not os.path.exists(originalThumbnailPath):
            raise HTTPException(
                status_code=404, detail="Thumbnail not found"
            )  # TODO replace to get the default image

        image = Image.open(originalThumbnailPath)
        image.thumbnail((400, 600))
        image.save(previewThumbnailPath)

        response = FileResponse(previewThumbnailPath, media_type="image/jpeg")
        return response
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


@seriesRouter.get("/random/{count}")
def getRandomSeries(count: int):
    pipeline = [{"$sample": {"size": count}}, {"$project": {"_id": 0}}]

    try:
        seriesList = list(seriesCollection.aggregate(pipeline))
        return Response.Success(seriesList)

    except Exception as e:
        return Response.Error(e)


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
