from fastapi import APIRouter
from database import episodesCollection

from classes.episode import Episode


episodeRouter = APIRouter(prefix="/episode")


@episodeRouter.get("/{episode_id}/exists")
def exists(episode_id: str):

    try:
        episode = episodesCollection.find_one({"id": episode_id})

        if episode == None:
            return False

    except Exception as e:
        print(e)

    return True


@episodeRouter.get("/{episode_id}")
def getEpisodeByID(episode_id: str):
    return {"id": episode_id}


# display all episodes with their season and episode number
@episodeRouter.get("/all/{series_id}")
def getAllEpisodesBySeriesID(series_id: str):
    return {"series_id": series_id, "episodes": []}


@episodeRouter.post("/add")
def addEpisode(episode: Episode):
    return {"episode": episode}


# to display the episode card with the thumbnail (downscaled image for better performance)
@episodeRouter.get("/thumbnail/{episode_id}")
def getThumbnail(episode_id: str):
    return {"episode_id": episode_id, "thumbnail": "thumbnail_url"}


@episodeRouter.get("/video/{episode_id}")
def getVideo(episode_id: str):
    return {"episode_id": episode_id, "video": "video_url"}


# to display the episode card percent watched
@episodeRouter.get("/percent_watched/{episode_id}")
def getPercentWatched(episode_id: str):
    return {"episode_id": episode_id, "percent_watched": 0.0}
