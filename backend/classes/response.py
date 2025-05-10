from typing import Generic, Optional, TypeVar

from pydantic import BaseModel

from classes.media import Media


T = TypeVar("T")


class Response(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[str] = None

    @staticmethod
    def Error(error: Exception):
        return Response[T](success=False, error=str(error))

    @staticmethod
    def Success(data: T):
        return Response[T](success=True, data=data)


class CurrentMediaResponse(BaseModel, Generic[T]):
    type: str | None = None
    media: T | None = None
