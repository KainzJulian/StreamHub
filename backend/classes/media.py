from typing import Optional
from pydantic import BaseModel, Field
from classes import MediaGenre


class Media(BaseModel):
    id: str = Field(alias="_id")

    title: str = ""
    description: str = ""

    # path to the folder of the media media/series/AOT or media/movies/Avatar
    path: str = ""

    genreList: list[MediaGenre] = []

    # When there will be more episodes in the future
    # Or more movies of the same franchise
    isComplete: bool | None = None

    rating: int | None = None

    thumbnailPath: Optional[str]

    watched: bool = False
