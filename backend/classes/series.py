from classes.episode import Episode
from classes.media import Media


class Series(Media):
    episodeList: list[Episode] = []
