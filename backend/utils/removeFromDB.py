from uuid import uuid5, NAMESPACE_DNS

from routes import episodeRoute, movieRoute


def removeEpisode(relPath: str):
    newPath = relPath.split(".mp4")[0].replace("\\", "/")
    id = str(uuid5(NAMESPACE_DNS, newPath))
    episodeRoute.removeEpisode(id)


# movies/movie/MovieName.mp4
def removeMovie(relPath: str):
    newPath = relPath.split(".mp4")[0].replace("\\", "/")
    id = str(uuid5(NAMESPACE_DNS, newPath))
    movieRoute.removeMovie(id)


def removeSeries(relPath: str):
    pass


def removeSeason(relPath: str):
    pass
