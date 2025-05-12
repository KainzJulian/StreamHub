import os
from fastapi import HTTPException
from fastapi.responses import FileResponse
from PIL import Image


def generatePreviewThumbnail(fullPath, thumbnailPath, title) -> FileResponse:
    originalThumbnailPath = f"{fullPath}/{thumbnailPath}"
    previewThumbnailPath = f"{fullPath}/{title}_preview.jpg"

    if os.path.exists(previewThumbnailPath):
        return FileResponse(previewThumbnailPath, media_type="image/jpeg")

    if not os.path.exists(originalThumbnailPath):
        raise HTTPException(status_code=404, detail="Thumbnail not found")

    image = Image.open(originalThumbnailPath)
    image.thumbnail((400, 600))
    image.save(previewThumbnailPath)

    return FileResponse(previewThumbnailPath, media_type="image/jpeg")
