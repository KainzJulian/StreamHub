from typing import Optional
from pydantic import BaseModel, Field

from classes.media import Media


class Episode(Media):
    episode: int | None = None
    season: int

    durationWatched: int = 0
    duration: int

    seriesID: str
