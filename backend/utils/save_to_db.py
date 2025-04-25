from pymediainfo import MediaInfo
import os
import subprocess
from uuid import NAMESPACE_DNS, uuid4, uuid5
import uuid
from moviepy.editor import VideoFileClip
from re import search
import scandir

from routes import episodeRoute
from routes import seriesRoute
from classes.episode import Episode
from classes.series import Series
from classes.movie import Movie


def saveMoviesToDB(path: str):

    defaultThumbnailPath = os.path.basename(path) + ".jpg"

    validExtensions = ".mp4"
    movies: list[Movie] = []

    for root, _, files in scandir.walk(path):

        relPath = root.replace("\\", "/")
        relativePath = relPath.split("/")

        for file in files:

            if not file.endswith(validExtensions):
                continue

            pth = relativePath[-2:]
            pth.append(file)

            mediaPath = "/".join(pth)

            thumbnailPath = getThumbnailPath(relPath, mediaPath)

            if thumbnailPath == None:
                thumbnailPath = defaultThumbnailPath

            movies.append(
                Movie(
                    _id=str(uuid4()),
                    mediaPath=mediaPath,
                    thumbnailPath=thumbnailPath,
                    duration=getVideoLengthInSeconds(relPath + "/" + file),
                )
            )

    print(movies)


def uploadEpisodesToSeries(fullPath: str, seriesName: str) -> None:

    print(seriesName)

    relativePath: list[str] = []
    relativePath.append(fullPath.split("/")[-1])
    relativePath.append(seriesName)
    print(relativePath)
    relativePathString = "/".join(relativePath)

    for root, _, files in scandir.walk(fullPath + "/" + seriesName):

        if len(files) == 0:
            continue

        season = root.replace("\\", "/").split("/")[-1]

        for file in files:

            if not file.endswith(".mp4"):
                continue

            episodeName = os.path.splitext(file)[0]
            mediaPathString = f"{relativePathString}/{season}/{episodeName}"
            mediaPath = mediaPathString.split("/")

            print(mediaPath)
            print(mediaPathString)

            episode = int(mediaPath[-1])
            thumbnailPath = mediaPathString + ".jpg"

            if not os.path.exists(f"{fullPath}/{episode}.jpg"):
                thumbnailPath = None

            seriesID = str(uuid5(uuid.NAMESPACE_DNS, mediaPathString))

            print(root)
            print(get_duration_fast(f"{root}/{mediaPath[-1]}.mp4"))

            episodeRoute.addEpisode(
                Episode(
                    _id=seriesID,
                    mediaPath=mediaPathString + ".mp4",
                    thumbnailPath=thumbnailPath,
                    episode=episode,
                    season=season,
                    duration=get_duration_fast(f"{root}/{mediaPath[-1]}.mp4"),
                    seriesID=seriesID,
                )
            )

    pass


def createSeriesFromPath(path) -> None:
    paths = scandir.listdir(path)
    print(paths)

    for i in paths:
        id = str(uuid5(uuid.NAMESPACE_DNS, i))
        exists = seriesRoute.exists(id)

        if exists:
            continue

        series = Series(
            _id=id,
            path=f"{os.path.basename(path)}/{i}",
            thumbnailPath=getThumbnailPath(path, i),
            episodeList=[],
        )
        print(series)
        seriesRoute.addSeries(series)


def getEpisodeSeasonNumber(relPath, seasonEpisodePath) -> int:
    season_episode = search(r"\d+", seasonEpisodePath)
    if season_episode == None:
        raise Exception("Could not find Episode or Season number in " + relPath)

    return int(season_episode.group())


def getVideoLengthInSeconds(path: str) -> int:
    try:
        clip = VideoFileClip(path)
        return int(clip.duration)

    except Exception as e:
        print(f"Error reading video length for {path}: {e}")
        return 0


def getThumbnailPath(fullPath: str, mediaPath: str) -> str | None:

    thumbnailPath = os.path.splitext(mediaPath)[0] + ".jpg"
    thumbnailName = os.path.basename(thumbnailPath)

    if not os.path.exists(fullPath + "/" + thumbnailName):
        return None

    return thumbnailPath


def get_duration_fast(path: str) -> int:

    media_info = MediaInfo.parse(path)
    for track in media_info.tracks:
        if track.track_type == "Video":
            return int(float(track.duration) / 1000)
    return 0
