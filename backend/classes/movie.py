from typing import Optional
from bson import ObjectId
from classes.media import Media


class Movie(Media):
    duration: int
    durationWatched: int = 0
