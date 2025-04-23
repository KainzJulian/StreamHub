from pydantic import BaseModel


class CurrentMedia(BaseModel):
    mediaID: str = ""
