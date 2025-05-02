from typing import Optional
from pydantic import BaseModel, Field


class Episode(BaseModel):
    id: str  # generated from uuid5(path) path="series/seriesName/1/1"

    title: str | None = None
    mediaPath: str

    episode: int | None = None
    season: int

    watched: bool = False

    durationWatched: int = 0
    duration: int

    seriesID: str
