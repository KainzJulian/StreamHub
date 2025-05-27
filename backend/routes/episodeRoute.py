import os
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse, StreamingResponse
from PIL import Image

from utils.get_thumbnail_paths import getThumbnailPaths
from utils.get_env import getENV
from classes.response import Response
from database import episodesCollection
from classes.episode import Episode


episodeRouter = APIRouter(prefix="/episodes", tags=["episode"])
mediaPath = getENV("MEDIA_PATH")
cleanupOrphanedMedia = getENV("CLEANUP_ORPHANED_MEDIA")


@episodeRouter.get("/")
def getAllEpisodesBySeriesID(series_id: str) -> Response[list[Episode]]:
    try:
        episodeList = list(
            episodesCollection.find({"seriesID": series_id}, {"_id": 0}).sort(
                [("season", 1), ("episode", 1)]
            )
        )
        return Response.Success(episodeList)

    except Exception as e:
        return Response.Error(e)


@episodeRouter.get("/{episode_id}/episode")
def getEpisodeByID(episode_id: str) -> Response[Episode]:
    try:
        episode = episodesCollection.find_one({"id": episode_id}, {"_id": 0})
        return Response.Success(episode)

    except Exception as e:
        return Response.Error(e)


@episodeRouter.get("/{episode_id}/exists")
def exists(episode_id: str) -> Response[bool]:

    try:
        episode = episodesCollection.find_one({"id": episode_id})

        if episode == None:
            return Response.Success(False)

    except Exception as e:
        Response.Error(e)

    return Response.Success(True)


@episodeRouter.get("/{episode_id}/thumbnail_banner")
def getThumbnailBanner(episode_id: str):

    try:
        episode = episodesCollection.find_one({"id": episode_id}, {"mediaPath": True})

        if episode == None:
            raise HTTPException(
                status_code=404, detail="No Episode with the ID: " + episode_id
            )

        thumbnailPaths = getThumbnailPaths(episode["mediaPath"], mediaPath)
        thumbnail = thumbnailPaths[0]

        if thumbnail == "":
            path = f"{mediaPath}/{episode["mediaPath"]}"
            pathPart = path.split("/")[:-2]
            seriesTitle = pathPart[-1]
            pathPart.append(seriesTitle)

            thumbnail = "/".join(pathPart) + ".jpg"

        if not os.path.exists(thumbnail):
            return None

        response = FileResponse(
            thumbnail,
            media_type="image/jpeg",
            headers={"Cache-Control": "no-store, must-revalidate"},
        )
        return response

    except Exception as e:
        return Response.Error(e)


@episodeRouter.get("/{episode_id}/thumbnail_preview")
def getThumbnailPreview(episode_id: str):

    try:
        episode = episodesCollection.find_one({"id": episode_id}, {"mediaPath": True})

        if episode == None:
            raise HTTPException(
                status_code=404, detail="No Episode with the ID: " + episode_id
            )

        thumbnailPath = getThumbnailPaths(episode["mediaPath"], mediaPath)

        originalThumbnailPath = thumbnailPath[0]
        previewThumbnailPath = thumbnailPath[1]

        if originalThumbnailPath == "":
            path = f"{mediaPath}/{episode["mediaPath"]}"

            thumbnailPartPath = path.split("/")[:-2]
            seriesTitle = thumbnailPartPath[-1]
            thumbnailPartPath.append(seriesTitle)

            originalThumbnailPath = "/".join(thumbnailPartPath) + ".jpg"
            previewThumbnailPath = "/".join(thumbnailPartPath) + "_preview.jpg"

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


@episodeRouter.get("/{episode_id}/percent_watched")
def getPercentWatched(episode_id: str):
    return {"episode_id": episode_id, "percent_watched": 0.0}


@episodeRouter.post("/add")
def addEpisode(episode: Episode) -> Response[str]:
    try:
        episodesCollection.insert_one(episode.model_dump())
        return Response.Success("Added Episode: " + str(episode.title))
    except Exception as e:
        return Response.Error(e)


def removeEpisode(id: str):
    if not cleanupOrphanedMedia:
        return

    try:
        episodesCollection.find_one_and_delete({"id": id})
    except Exception as e:
        raise e
