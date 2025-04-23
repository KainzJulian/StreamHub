import os
from dotenv import find_dotenv, load_dotenv
from utils.get_env import getENV
from utils.save_to_db import saveMoviesToDB, saveSeriesToDB


load_dotenv(find_dotenv(".env"))
seriesPath = getENV("SERIES_PATH")
moviesPath = getENV("MOVIES_PATH")


def loadFiles() -> None:

    # saveMoviesToDB(moviesPath)
    saveSeriesToDB(seriesPath)

    # for dirpath, dirnames, filenames in os.walk():
    #     print(dirpath)
    #     print(dirnames)
    #     print(filenames)
    #     print()

    pass
