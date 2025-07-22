from uuid import uuid5, NAMESPACE_DNS
from routes import episodeRoute, movieRoute, seriesRoute


def removeEpisode(relPath: str):
    newPath = relPath.split(".mp4")[0].replace("\\", "/")
    id = str(uuid5(NAMESPACE_DNS, newPath))
    episodeRoute.removeEpisode(id)


def removeMovie(relPath: str):
    newPath = relPath.split(".mp4")[0].replace("\\", "/")
    id = str(uuid5(NAMESPACE_DNS, newPath))
    movieRoute.removeMovie(id)


def removeSeries(relPath: str):
    path = "/".join(relPath.replace("\\", "/").split("/")[-2:])
    print(path)
    seriesRoute.removeSeriesByPath(path)


def removeSeason(relPath: str):
    path = "/".join(relPath.replace("\\", "/").split("/")[-3:])
    episodeRoute.removeEpisodesByPath(path)


def removeMovieFolder(relPath: str):

    path = "/".join(relPath.replace("\\", "/").split("/")[-2:]) + "/"

    movieRoute.removeMovieByPath(path)

    print("removeMovieFolder")
