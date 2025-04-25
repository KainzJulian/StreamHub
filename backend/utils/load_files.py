import time
import scandir
from uuid import uuid4
from dotenv import find_dotenv, load_dotenv
from routes import seriesRoute
from classes.series import Series
from utils.get_env import getENV
from utils.save_to_db import (
    createSeriesFromPath,
    uploadMoviesToDB,
    uploadEpisodesToSeries,
)


load_dotenv(find_dotenv(".env"))
seriesPath = getENV("SERIES_PATH")
moviesPath = getENV("MOVIES_PATH")


def saveFilesToDB() -> None:

    start_time = time.time()

    uploadMoviesToDB(moviesPath)

    # createSeriesFromPath(seriesPath)

    # for name in scandir.listdir(seriesPath):
    #     uploadEpisodesToSeries(seriesPath, name)

    end_time = time.time()

    print(f"execution time: {end_time - start_time} seconds")
