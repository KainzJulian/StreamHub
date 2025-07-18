import os
from PIL import Image
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pymongo import DESCENDING
from sympy import false

from routes import episodeRoute
from classes.episode import Episode
from utils.save_to_db import uploadEpisodesToSeries
from utils.get_thumbnail_paths import getThumbnailPaths
from utils.get_env import getENV
from classes.response import Response
from database import seriesCollection
from database import episodesCollection
from classes.series import Series
from routes.episodeRoute import (
    deleteAllEpisodesBySeriesID,
    removeEpisode,
)

seriesRouter = APIRouter(prefix="/series", tags=["series"])


seriesPath = getENV("MEDIA_PATH") + "/series"
mediaPath = getENV("MEDIA_PATH")
removeOrphanedMedia = getENV("REMOVE_ORPHANED_MEDIA")


@seriesRouter.get("/")
def getAllSeries() -> Response[list[Series]]:
    try:
        removeOrphanedSeries()

        seriesList = list(seriesCollection.find({}, {"_id": 0}))

        return Response.Success(seriesList)

    except Exception as e:
        return Response.Error(e)


def removeOrphanedSeries():
    seriesList = list(
        seriesCollection.find({}, {"_id": False, "id": True, "mediaPath": True})
    )

    if removeOrphanedMedia == "false":
        return

    for series in seriesList:
        if not os.path.exists(mediaPath + "/" + series["mediaPath"]):
            id = series["id"]
            seriesCollection.find_one_and_delete({"id": id})
            deleteAllEpisodesBySeriesID(id)


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

        seriesMediaPath = seriesCollection.find_one(
            {"id": series_id}, {"mediaPath": True}
        )

        episodeList = list(
            episodesCollection.find({"seriesID": series_id}, {"_id": False})
        )

        if seriesMediaPath != None:
            uploadEpisodesToSeries(
                seriesPath,
                seriesMediaPath["mediaPath"].split("/")[-1],
            )

        if episodeList == None:
            return Response.Error(
                Exception("No Series found with the ID: " + series_id)
            )

        if removeOrphanedMedia == "true":
            for episode in episodeList:
                if not os.path.exists(mediaPath + "/" + episode["mediaPath"]):
                    removeEpisode(episode["id"])

        seriesCursor = seriesCollection.aggregate(pipeline)
        series = next(seriesCursor, None)

        return Response.Success(series)

    except Exception as e:
        return Response.Error(e)


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
        series = seriesCollection.find_one({"id": series_id}, {"mediaPath": True})

        if series == None:
            raise HTTPException(
                status_code=404, detail="No Series with the ID: " + series_id
            )

        seriesMediaPath: str = series["mediaPath"]
        seriesName = seriesMediaPath.split("/")[-1]
        thumbnail = getThumbnailPaths(seriesName, f"{seriesPath}/{seriesName}")

        if not os.path.exists(thumbnail[0]):
            return None

        response = FileResponse(
            thumbnail[0],
            media_type="image/jpeg",
            headers={"Cache-Control": "no-store, must-revalidate"},
        )
        return response

    except Exception as e:
        return Response.Error(e)


@seriesRouter.get("/{series_id}/thumbnail_preview")
def getThumbnail(series_id: str):

    try:
        series = seriesCollection.find_one({"id": series_id}, {"mediaPath": True})

        if series == None:
            raise HTTPException(
                status_code=404, detail="No Series with the ID: " + series_id
            )

        seriesMediaPath: str = series["mediaPath"]
        seriesName = seriesMediaPath.split("/")[-1]
        thumbnail = getThumbnailPaths(
            seriesName, f"{seriesPath}/{seriesName.split("/")[-1]}"
        )

        originalThumbnailPath = thumbnail[0]
        previewThumbnailPath = thumbnail[1]

        if os.path.exists(previewThumbnailPath):
            return FileResponse(
                previewThumbnailPath,
                media_type="image/jpeg",
                headers={"Cache-Control": "no-store, must-revalidate"},
            )

        if not os.path.exists(originalThumbnailPath):
            return None

        image = Image.open(originalThumbnailPath)
        image.thumbnail((350, 500))
        image.save(previewThumbnailPath, quality=60)

        response = FileResponse(
            previewThumbnailPath,
            media_type="image/jpeg",
            headers={"Cache-Control": "no-store, must-revalidate"},
        )
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
def getRandomSeries(count: int) -> Response[list[Series]]:

    if count == 0:
        pipeline = [{"$project": {"_id": False}}]
    else:
        pipeline = [{"$sample": {"size": count}}, {"$project": {"_id": False}}]

    try:
        seriesList = list(seriesCollection.aggregate(pipeline))
        return Response.Success(seriesList)

    except Exception as e:
        return Response.Error(e)


@seriesRouter.get("/search/{query}")
def searchSeries(query: str, genres: list[str]) -> Response[list[Series]]:

    pipe = {"title": {"$regex": query, "$options": "i"}}

    if genres != []:
        pipe = {
            "title": {"$regex": query, "$options": "i"},
            "genreList": {"$all": genres},
        }

    try:
        seriesList = list(
            seriesCollection.find(
                pipe,
                {"_id": False},
            )
        )
        return Response.Success(seriesList)

    except Exception as e:
        return Response.Error(e)


@seriesRouter.get("/highest_rated/{limit}")
def getHighestRatedSeries(limit: int) -> Response[list[Series]]:
    try:
        series = list(
            seriesCollection.find({}, {"_id": False})
            .sort("rating", DESCENDING)
            .limit(limit)
        )
        return Response.Success(series)

    except Exception as e:
        return Response.Error(e)


@seriesRouter.post("/{series_id}/watched")
def updateWatchedFlag(series_id: str, flag: bool) -> Response[bool]:

    try:
        seriesCollection.find_one_and_update(
            {"id": series_id}, {"$set": {"watched": flag}}
        )
        return Response.Success(True)

    except Exception as e:
        return Response.Error(e)


@seriesRouter.post("/{series_id}/duration")
def updateDuration(series_id: str, duration: int) -> Response[bool]:
    try:

        seriesCollection.find_one_and_update(
            {"id": series_id}, {"$set": {"duration": duration}}
        )

        return Response.Success(True)

    except Exception as e:
        return Response.Error(e)


@seriesRouter.post("/{series_id}/duration_watched")
def updateDurationWatched(series_id: str) -> Response[bool]:
    try:

        series = seriesCollection.find_one_and_update(
            {"id": series_id}, {"$inc": {"durationWatched": 1}}
        )

        if (
            episodeRoute.getCountBySeries(series_id).data
            <= series["durationWatched"] + 1
        ):
            return updateWatchedFlag(series_id, True)

        return Response.Success(False)

    except Exception as e:
        return Response.Error(e)


@seriesRouter.post("/update_duration")
def updateDurationInSeries() -> Response[bool]:
    try:

        series = getAllSeries().data

        if series == None:
            raise Exception("No Series Found")

        idList: list[str] = []

        for i in series:
            if isinstance(i, dict):
                idList.append(i["id"])

        for id in idList:
            count = episodeRoute.getCountBySeries(id)
            if count.data == None:
                continue

            updateDuration(id, count.data)

        return Response.Success(True)

    except Exception as e:
        return Response.Error(e)
