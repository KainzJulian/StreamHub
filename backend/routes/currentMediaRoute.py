import os
from typing import TypedDict
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from classes.response import CurrentMediaResponse
from utils.get_env import getENV
from classes.movie import Movie
from classes.episode import Episode
from classes.media import Media
from classes.current_media import CurrentMedia
from classes import Response
from database import currentMediaCollection
from database import movieCollection
from database import episodesCollection
from routes.movieRoute import removeMovie
from routes.episodeRoute import removeEpisode

currentMediaRouter = APIRouter(prefix="/current_media", tags=["currentMedia"])
mediaPath = getENV("MEDIA_PATH")
cleanupOrphanedMedia = getENV("CLEANUP_ORPHANED_MEDIA")


@currentMediaRouter.get("/get")
def getCurrentMedia() -> Response[CurrentMediaResponse]:

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
            return Response.Success(CurrentMediaResponse(type="episode", media=episode))

        else:
            return Response.Success(CurrentMediaResponse(type="movie", media=movie))

    except Exception as e:
        return Response.Error(e)


@currentMediaRouter.post("/")
def setCurrentMedia(current_media: CurrentMedia) -> Response:
    print(current_media)
    try:
        currentMediaCollection.delete_many({})
        currentMediaCollection.insert_one(current_media.model_dump())
        return Response.Success(True)

    except Exception as e:
        return Response.Error(e)


@currentMediaRouter.get("/video/{id}")
def getCurrentMediaVideo(id: str, request: Request):
    try:

        path = getMediaPath(id)

        range_header = request.headers.get("range")
        file_size = os.path.getsize(path)

        chunk_size = 1024 * 1024 * 1

        if range_header == None:

            def streamWholeVideo():
                with open(path, "rb") as file:
                    while chunk := file.read(chunk_size):
                        yield chunk

            return StreamingResponse(
                streamWholeVideo(),
                media_type="video/mp4",
                headers={"Accept-Ranges": "bytes", "Content-Length": str(file_size)},
            )

        try:
            range_value = range_header.replace("bytes=", "")
            start_str, end_str = range_value.split("-")
            start = int(start_str)
            end = int(end_str) if end_str else file_size - 1
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid Range header")

        if start >= file_size:
            raise HTTPException(status_code=416, detail="Requested Range Not Available")

        end = min(end, file_size - 1)
        content_length = end - start + 1

        def streamDataBytes():
            with open(path, "rb") as f:
                f.seek(start)
                remaining = content_length

                while remaining > 0:
                    read_length = min(chunk_size, remaining)
                    data = f.read(read_length)

                    if not data:
                        break

                    remaining -= len(data)
                    yield data

        headers = {
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Accept-Ranges": "bytes",
            "Content-Length": str(content_length),
        }

        return StreamingResponse(
            streamDataBytes(), status_code=206, media_type="video/mp4", headers=headers
        )

    except Exception as e:
        return Response.Error(e)


def getMediaPath(id: str) -> str:

    media = episodesCollection.find_one({"id": id}, {"_id": False, "mediaPath": True})
    print(media)

    if media:
        path = mediaPath + "/" + media["mediaPath"]
        if os.path.exists(path):
            return path

        removeEpisode(id)
        raise HTTPException(
            status_code=500, detail="No Episode Video File found for path: " + path
        )

    media = movieCollection.find_one({"id": id}, {"_id": False, "mediaPath": True})
    print(media)

    if media:
        path = mediaPath + "/" + media["mediaPath"]

        if os.path.exists(path):
            return path

        removeMovie(id)
        raise HTTPException(
            status_code=500, detail="No Movie Video File found for path: " + path
        )

    raise HTTPException(status_code=500, detail="No Media with the id found: " + id)
