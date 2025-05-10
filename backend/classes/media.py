from typing import Optional
from pydantic import BaseModel, Field
from classes.media_genre import MediaGenre


class Media(BaseModel):
    id: str  # generated from uuid5(SeriesName) SeriesName = "Attack on Titan"

    title: str | None = None
    description: str | None = None

    genreList: list[MediaGenre] = []

    # When there will be more episodes in the future
    # Or more movies of the same franchise
    isComplete: bool = True

    rating: int | None = None

    watched: bool = False
