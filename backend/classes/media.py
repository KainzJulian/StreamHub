from typing import Optional
from pydantic import BaseModel, Field
from classes.media_genre import MediaGenre


class Media(BaseModel):
    id: str

    title: str | None = None
    description: str | None = None

    genreList: list[MediaGenre] = []

    type: str = ""

    isComplete: bool = True

    durationWatched: int = 0
    duration: int = 0

    rating: int | None = None

    watched: bool = False

    mediaPath: str
