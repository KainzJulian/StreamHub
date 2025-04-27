from fastapi import APIRouter

from classes.response import Response
from database import episodesCollection
from classes.episode import Episode


episodeRouter = APIRouter(prefix="/episodes", tags=["episode"])


@episodeRouter.get("/{episode_id}/exists")
def exists(episode_id: str) -> Response[bool]:

    try:
        episode = episodesCollection.find_one({"id": episode_id})

        if episode == None:
            return Response.Success(False)

    except Exception as e:
        Response.Error(e)

    return Response.Success(True)


@episodeRouter.get("/{episode_id}/data")
def getEpisodeByID(episode_id: str) -> Response[Episode]:
    try:
        episode = episodesCollection.find_one({"id": episode_id}, {"_id": 0})
        return Response.Success(episode)

    except Exception as e:
        return Response.Error(e)


# display all episodes with their season and episode number
@episodeRouter.get("/")
def getAllEpisodesBySeriesID(series_id: str) -> Response[list[Episode]]:
    try:
        episodeList = list(episodesCollection.find({"seriesID": series_id}, {"_id": 0}))
        return Response.Success(episodeList)

    except Exception as e:
        return Response.Error(e)


@episodeRouter.post("/add")
def addEpisode(episode: Episode) -> Response[str]:
    try:
        episodesCollection.insert_one(episode.model_dump())
        return Response.Success("Added Episode: " + episode.title)
    except Exception as e:
        return Response.Error(e)


# to display the episode card with the thumbnail (downscaled image for better performance)
@episodeRouter.get("/{episode_id}/thumbnail")
def getThumbnail(episode_id: str):
    return {"episode_id": episode_id, "thumbnail": "thumbnail_url"}


@episodeRouter.get("/{episode_id}/video")
def getVideo(episode_id: str):
    return {"episode_id": episode_id, "video": "video_url"}


@episodeRouter.get("/{episode_id}/percent_watched")
def getPercentWatched(episode_id: str):
    return {"episode_id": episode_id, "percent_watched": 0.0}
