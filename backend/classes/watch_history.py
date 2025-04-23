import datetime
from pydantic import BaseModel, Field


class HistoryItem(BaseModel):
    id: str = Field(alias="_id")
    time: datetime.datetime


class WatchHistory(BaseModel):
    mediaIDList: list[HistoryItem]
