from typing import Optional
from pydantic import BaseModel, Field


class Episode(BaseModel):
    id: str = Field(alias="_id")
    title: str = ""
    mediaPath: str
    thumbnailPath: Optional[str]

    episode: int
    season: int

    watched: bool = False

    durationWatched: int = 0
    duration: int

    seriesID: str
