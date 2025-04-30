import os

from fastapi import HTTPException


def getThumbnailPaths(mediaPath: str, fullPath) -> tuple[str, str]:

    mediaArray = mediaPath.split("/")
    fileName = os.path.splitext(mediaArray[-1])[0]

    mediaArray[-1] = fileName + ".jpg"
    originalThumbnailPath = f"{fullPath}/{"/".join(mediaArray)}"

    mediaArray[-1] = fileName + "_preview.jpg"
    previewThumbnailPath = f"{fullPath}/{"/".join(mediaArray)}"

    if not os.path.exists(originalThumbnailPath):
        return "", ""

    return originalThumbnailPath, previewThumbnailPath
