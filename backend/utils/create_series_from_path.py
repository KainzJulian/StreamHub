import scandir
from uuid import uuid5, NAMESPACE_DNS

from utils.get_env import getENV
from classes.series import Series
from routes import seriesRoute


def createSeriesFromPath(
    path: str,
) -> None:

    print("Creating Series...")

    seriesPath = path.split("/")[-1]

    paths: list[str] = list(scandir.listdir(path))

    for i in paths:

        if i.endswith(".jpg"):
            continue

        seriesPathString = f"{seriesPath}/{i}"
        id = str(uuid5(NAMESPACE_DNS, seriesPathString))

        exists = seriesRoute.exists(id)

        if exists.data:
            continue

        series = Series(
            id=id,
            title=i,
            type="Series",
            mediaPath=seriesPathString,
        )
        seriesRoute.addSeries(series)

    print("Done")
