import re
from pymediainfo import MediaInfo
import os
from uuid import uuid4, uuid5
import uuid
import scandir

from routes import seriesRoute, episodeRoute, movieRoute
from classes.episode import Episode
from classes.series import Series
from classes.movie import Movie


def uploadMoviesToDB(fullPath: str):

    print("Adding Movies...")

    relativePathString = os.path.basename(fullPath)

    for root, _, files in scandir.walk(fullPath):

        if len(files) == 0:
            continue

        movieFranchise = root.replace("\\", "/").split("/")[-1]

        for file in files:

            if not file.endswith(".mp4"):
                continue

            print(file)

            movieName = os.path.splitext(file)[0]

            mediaPathString = f"{relativePathString}/{movieFranchise}/{movieName}"  # movies/moviename/1

            id = str(uuid5(uuid.NAMESPACE_DNS, mediaPathString))

            exists = movieRoute.exists(id)

            if exists.data:
                continue

            thumbnailPath = mediaPathString + ".jpg"

            if not os.path.exists(f"{root}/{movieName}.jpg"):
                thumbnailPath = None

            movieRoute.addMovie(
                Movie(
                    id=id,
                    mediaPath=mediaPathString + ".mp4",
                    thumbnailPath=thumbnailPath,
                    duration=getVideoLengthInSeconds(f"{root}/{movieName}.mp4"),
                )
            )
    print("Done")


def uploadEpisodesToSeries(fullPath: str, seriesName: str) -> None:

    print(seriesName)

    relativePath: list[str] = []
    relativePath.append(os.path.basename(fullPath))
    relativePath.append(seriesName)
    relativePathString = "/".join(relativePath)

    for root, _, files in scandir.walk(fullPath + "/" + seriesName):

        if len(files) == 0:
            continue

        season = root.replace("\\", "/").split("/")[-1]

        for file in files:

            if not file.endswith(".mp4"):
                continue

            episodeName = os.path.splitext(file)[0]

            # series/1/1
            mediaPathString = f"{relativePathString}/{season}/{episodeName}"

            episodeID = str(uuid5(uuid.NAMESPACE_DNS, mediaPathString))
            exists = episodeRoute.exists(episodeID)

            if exists.data:
                continue

            mediaPath = mediaPathString.split("/")

            episode = int(mediaPath[-1])
            thumbnailPath = mediaPathString + ".jpg"

            if not os.path.exists(f"{fullPath}/{episode}.jpg"):
                thumbnailPath = None

            seriesID = str(uuid5(uuid.NAMESPACE_DNS, mediaPath[-3]))

            episodeRoute.addEpisode(
                Episode(
                    id=episodeID,
                    mediaPath=mediaPathString + ".mp4",  # series/1/1.mp4
                    thumbnailPath=thumbnailPath,
                    episode=episode,
                    season=season,
                    duration=getVideoLengthInSeconds(f"{root}/{mediaPath[-1]}.mp4"),
                    seriesID=seriesID,
                )
            )


def createSeriesFromPath(path) -> None:

    print("Creating Series...")

    paths = scandir.listdir(path)
    print(paths)

    for i in paths:
        id = str(uuid5(uuid.NAMESPACE_DNS, i))  # i = AOT
        exists = seriesRoute.exists(id)

        if exists.data:
            continue

        series = Series(id=id, thumbnailPath=getThumbnailPath(path, i), title=i)
        seriesRoute.addSeries(series)

    print("Done")


def getVideoLengthInSeconds(path: str) -> int:
    media_info = MediaInfo.parse(path)
    for track in media_info.tracks:
        if track.track_type == "Video":
            return int(float(track.duration) / 1000)
    return 0


def getThumbnailPath(fullPath: str, mediaPath: str) -> str | None:

    thumbnailPath = os.path.splitext(mediaPath)[0] + ".jpg"
    thumbnailName = os.path.basename(thumbnailPath)

    if not os.path.exists(fullPath + "/" + thumbnailName):
        return None

    return thumbnailPath
