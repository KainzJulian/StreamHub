from enum import Enum
from pydantic import BaseModel


class MediaGenre(str, Enum):
    ACTION = "Action"
    ADVENTURE = "Adventure"
    ANIMATION = "Animation"
    COMEDY = "Comedy"
    CRIME = "Crime"
    DRAMA = "Drama"
    FANTASY = "Fantasy"
    HISTORICAL = "Historical"
    HORROR = "Horror"
    ROMANCE = "Romance"
    SCIFI = "Science-Fiction"
    THRILLER = "Thriller"
