from typing import Optional
from pydantic import BaseModel, Field
from classes import MediaGenre


class Media(BaseModel):
    id: str  # generated from uuid5(SeriesName) SeriesName = "Attack on Titan"

    title: str = ""
    description: str = ""

    genreList: list[MediaGenre] = []

    # When there will be more episodes in the future
    # Or more movies of the same franchise
    isComplete: bool | None = None

    rating: int | None = None

    thumbnailPath: Optional[str]

    watched: bool = False
