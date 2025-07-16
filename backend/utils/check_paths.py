from utils.get_env import getENV
from pathlib import Path


def checkPaths() -> None:

    mediaPath = Path(getENV("MEDIA_PATH"))

    if mediaPath.exists():
        return
    else:
        raise Exception("No Media Folder found in Path: " + str(mediaPath.absolute()))
