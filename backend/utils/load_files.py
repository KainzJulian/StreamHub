import time
import scandir
from uuid import uuid4
from dotenv import find_dotenv, load_dotenv
from routes import seriesRoute
from classes.series import Series
from utils.get_env import getENV
from utils.save_to_db import (
    createSeriesFromPath,
    saveMoviesToDB,
    uploadEpisodesToSeries,
)


load_dotenv(find_dotenv(".env"))
seriesPath = getENV("SERIES_PATH")
moviesPath = getENV("MOVIES_PATH")


def saveFilesToDB() -> None:

    # saveMoviesToDB(moviesPath)

    createSeriesFromPath(seriesPath)

    start_time = time.time()

    for name in scandir.listdir(seriesPath):
        uploadEpisodesToSeries(seriesPath, name)

    end_time = time.time()

    seriesList: list[Series] = []

    # for i in seriesDict.keys():
    #     seriesList.append(
    #         Series(
    #             _id=str(uuid4()),
    #             thumbnailPath=f"{os.path.basename(seriesPath)}/{i}.jpg",
    #             title=i,
    #             episodeList=seriesDict[i],
    #         )
    #     )

    print(seriesList)

    print(f"execution time: {end_time - start_time} seconds")

    pass
