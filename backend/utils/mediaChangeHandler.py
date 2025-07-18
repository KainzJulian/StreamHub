from pathlib import Path
from enum import Enum
import os
from watchfiles import Change, awatch
from utils.create_series_from_path import createSeriesFromPath
from utils.save_to_db import uploadEpisodesToSeries, uploadMoviesToDB
from utils.removeFromDB import removeEpisode, removeMovie
from utils.get_env import getENV

mediaPath = getENV("MEDIA_PATH")


class MediaChangeType(Enum):
    MOVIE_FILE = 1
    MOVIE_FOLDER = 2
    SERIES_FOLDER = 3
    SEASON_FOLDER = 4
    EPISODE_FILE = 5


class MediaChangeHandler:

    def __init__(self, path: str) -> None:
        self.path = path

    async def watch_for_changes(self):
        async for changes in awatch(self.path, ignore_permission_denied=True):
            for changeType, changedPath in changes:

                filename = os.path.basename(changedPath)
                file = os.path.splitext(filename)

                relPath = self.getRelativePath(changedPath)
                relativePathArray = str(relPath).split("\\")

                isMP4File = file[1] == ".mp4"
                isFile = file[1] != ""
                isFolder = file[1] == ""

                isInSeriesPath = relativePathArray[0] == "series"
                isInMoviesPath = relativePathArray[0] == "movies"

                print(relativePathArray)

                isEpisode = isFile and isMP4File and isInSeriesPath
                isMovie = isFile and isMP4File and isInMoviesPath
                isMovieFolder = isFolder and isInMoviesPath
                isSeries = isFolder and isInSeriesPath and len(relativePathArray) == 2
                isSeason = isFolder and isInSeriesPath and len(relativePathArray) == 3

                if changeType == Change.deleted and isSeries:
                    self.removeSeries(changedPath)
                    continue

                if changeType == Change.deleted and isSeason:
                    self.removeSeason(changedPath)
                    continue

                if changeType == Change.deleted and isEpisode:
                    self.removeEpisode(changedPath)
                    continue

                if changeType == Change.added and isEpisode:
                    self.addEpisode(changedPath)
                    continue

                if changeType == Change.deleted and isMovie:
                    self.removeMovie(changedPath)
                    continue

                if changeType == Change.added and isMovie:
                    self.addMovie(changedPath)
                    continue

                if changeType == Change.deleted and isMovieFolder:
                    self.removeMovieFolder(changedPath)
                    continue

    def removeEpisode(self, path: str):
        print("remove - Episode")
        removeEpisode(self.getRelativePath(path))

    def addEpisode(self, path: str):
        print("add - Episode")

        seriesName = self.getRelativePath(path).split("\\")[1]
        path = "/".join(path.split("\\")[:-3])

        uploadEpisodesToSeries(path, seriesName)

    def removeMovie(self, path: str):
        print("remove - Movie")
        removeMovie(self.getRelativePath(path))

    def addMovie(self, path: str):
        print("add - Movie")
        path = "/".join(path.split("\\")[:-2])
        uploadMoviesToDB(path)

    def removeMovieFolder(self, path: str):
        print("remove - MovieFolder")

    def addMovieFolder(self, path: str):
        print("add - MovieFolder")
        uploadMoviesToDB(path)

    def removeSeries(self, path: str):
        print("remove - Series")

    def addSeries(self, path: str):
        print("add - Series")
        createSeriesFromPath(path)

    def addSeason(self, path: str):
        print("add - Season")
        # uploadEpisodesToSeries

    def removeSeason(self, path: str):
        print("remove - Season")

    def getRelativePath(self, path: str) -> str:

        try:
            return str(Path(path).relative_to(mediaPath))
        except ValueError:
            raise Exception("Folder not found: " + mediaPath)

    # Media\series\newSerie
    # Media\series\newSerie\1
    # Media\series\newSerie\1\Episode.mp4
    # Media\movies\newMovie
    # Media\movies\newMovie\movieName.mp4
