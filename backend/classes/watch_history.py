import datetime
from pydantic import BaseModel, Field


class HistoryItem(BaseModel):
    id: str
    type: str
    time: datetime.datetime
