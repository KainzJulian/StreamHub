from fastapi import APIRouter
from numpy import str_
from classes.movie import Movie
from classes.episode import Episode
from classes.media import Media
from classes.current_media import CurrentMedia
from classes import Response
from database import currentMediaCollection
from database import movieCollection
from database import episodesCollection

currentMediaRouter = APIRouter(prefix="/current_media", tags=["currentMedia"])


@currentMediaRouter.get("/get")
def getCurrentMedia() -> Response[Episode | Movie]:
    try:
        currentMedia = currentMediaCollection.find_one({}, {"_id": False})

        if currentMedia == None:
            return Response.Success(None)

        id = currentMedia["mediaID"]

        movie = movieCollection.find_one({"id": id}, {"_id": False})

        print(movie)
        if movie == None:
            episode = episodesCollection.find_one({"id": id}, {"_id": False})
            print(episode)
            return Response.Success(episode)

        else:
            return Response.Success(movie)

    except Exception as e:
        return Response.Error(e)


@currentMediaRouter.post("/")
def setCurrentMedia(current_media: CurrentMedia) -> Response:
    try:
        currentMediaCollection.delete_many({})
        currentMediaCollection.insert_one(current_media.model_dump())
        return Response.Success(None)

    except Exception as e:
        return Response.Error(e)
