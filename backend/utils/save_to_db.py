import os
from uuid import uuid4
from moviepy.editor import VideoFileClip
import re

from classes.episode import Episode
from classes.series import Series
from classes.movie import Movie


def saveMoviesToDB(path: str):

    validExtensions = ".mp4"
    movies: list[Movie] = []

    for root, _, files in os.walk(path):

        relPath = root.replace("\\", "/")
        relativePath = relPath.split("/")

        for file in files:

            if not file.endswith(validExtensions):
                continue

            pth = relativePath[-2:]
            pth.append(file)

            mediaPath = "/".join(pth)

            movies.append(
                Movie(
                    _id=str(uuid4()),
                    mediaPath=mediaPath,
                    thumbnailPath=getThumbnailPath(relativePath, mediaPath),
                    duration=getVideoLengthInSeconds(relPath + "/" + file),
                )
            )

    print(movies)


def saveSeriesToDB(path: str):

    series: list[Series] = []
    thumbnailPath = ""

    validExtensions = ".mp4"

    for root, _, files in os.walk(path):

        episodeList: list[Episode] = []

        relPath = root.replace("\\", "/")
        relativePath = relPath.split("/")

        print(relativePath)

        for file in files:

            print(file)

            if not file.endswith(validExtensions):
                continue

            episode = getEpisodeSeasonNumber(relPath, file)
            season = getEpisodeSeasonNumber(relPath, relativePath[-1])

            duration = getVideoLengthInSeconds(relPath + "/" + file)

            episodeList.append(
                Episode(
                    _id=str(uuid4()),
                    mediaPath="",
                    thumbnailPath="",
                    episode=episode,
                    season=season,
                    duration=duration,
                )
            )

        series.append(
            Series(_id=str(uuid4()), thumbnailPath=thumbnailPath, episodeList=[])
        )


def getEpisodeSeasonNumber(relPath, seasEpiPath) -> int:
    season_episode = re.search(r"\d+", seasEpiPath)
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


def getThumbnailPath(relativePath: list[str], mediaPath: str) -> str:
    thumbnailPath = os.path.splitext(mediaPath)[0] + ".jpg"

    thumbnail = thumbnailPath.split("/")[-1]

    if not os.path.exists("/".join(relativePath) + "/" + thumbnail):
        thumbnailPath = ""

    return thumbnailPath
