import time
import scandir
from dotenv import find_dotenv, load_dotenv
from utils.create_series_from_path import createSeriesFromPath
from utils.get_env import getENV
from utils.save_to_db import (
    uploadMoviesToDB,
    uploadEpisodesToSeries,
)


load_dotenv(find_dotenv(".env"))
seriesPath = getENV("MEDIA_PATH") + "/series"
moviesPath = getENV("MEDIA_PATH") + "/movies"


def saveFilesToDB() -> None:

    start_time = time.time()

    uploadMoviesToDB(moviesPath)

    createSeriesFromPath(seriesPath)

    print("Adding Episodes to Series...")

    for name in scandir.listdir(seriesPath):
        uploadEpisodesToSeries(seriesPath, name)

    print("Done")

    end_time = time.time()

    print(f"execution time: {end_time - start_time} seconds")
