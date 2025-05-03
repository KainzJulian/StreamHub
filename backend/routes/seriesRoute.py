import os
from PIL import Image
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from classes.episode import Episode
from utils.save_to_db import uploadEpisodesToSeries
from utils.get_thumbnail_paths import getThumbnailPaths
from utils.get_env import getENV
from classes.response import Response
from database import seriesCollection
from database import episodesCollection
from classes.series import Series

seriesRouter = APIRouter(prefix="/series", tags=["series"])


seriesPath = getENV("MEDIA_PATH") + "/series"
mediaPath = getENV("MEDIA_PATH")


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
                "let": {"series_id": "$id"},
                "pipeline": [
                    {"$match": {"$expr": {"$eq": ["$seriesID", "$$series_id"]}}},
                    {"$sort": {"season": 1, "episode": 1}},
                ],
                "as": "episodeList",
            }
        },
        {"$project": {"_id": False, "episodeList._id": False}},
    ]

    try:

        seriesTitle = seriesCollection.find_one({"id": series_id}, {"title": True})

        episodeList = list(
            episodesCollection.find({"seriesID": series_id}, {"_id": False})
        )

        if seriesTitle != None:
            uploadEpisodesToSeries(seriesPath, seriesTitle["title"])

        if episodeList == None:
            return Response.Error(
                Exception("No Series found with the ID: " + series_id)
            )

        for episode in episodeList:
            # print(episode)
            if not os.path.exists(mediaPath + "/" + episode["mediaPath"]):
                removeEpisode(episode["id"])

        seriesCursor = seriesCollection.aggregate(pipeline)
        series = next(seriesCursor, None)

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
        series = seriesCollection.find_one({"id": series_id}, {"title": True})

        if series == None:
            raise HTTPException(
                status_code=404, detail="No Series with the ID: " + series_id
            )

        seriesName = series["title"]
        thumbnail = getThumbnailPaths(seriesName, f"{seriesPath}/{seriesName}")

        if not os.path.exists(thumbnail[0]):
            return None

        response = FileResponse(thumbnail[0], media_type="image/jpeg")
        return response

    except Exception as e:
        return Response.Error(e)


@seriesRouter.get("/{series_id}/thumbnail_preview")
def getThumbnail(series_id: str):

    try:
        series = seriesCollection.find_one({"id": series_id}, {"title": True})

        if series == None:
            raise HTTPException(
                status_code=404, detail="No Series with the ID: " + series_id
            )

        seriesName = series["title"]
        thumbnail = getThumbnailPaths(seriesName, f"{seriesPath}/{seriesName}")

        originalThumbnailPath = thumbnail[0]
        previewThumbnailPath = thumbnail[1]

        if os.path.exists(previewThumbnailPath):
            return FileResponse(previewThumbnailPath, media_type="image/jpeg")

        if not os.path.exists(originalThumbnailPath):
            return None

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


# TODO add removeEpisode to episodeRouter
def removeEpisode(episode_id: str):
    try:
        episodesCollection.find_one_and_delete({"id": episode_id})
    except Exception as e:
        raise e
