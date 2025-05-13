import scandir
from uuid import uuid5, NAMESPACE_DNS

from classes.series import Series
from routes import seriesRoute


def createSeriesFromPath(path) -> None:

    print("Creating Series...")

    paths: list[str] = list(scandir.listdir(path))

    for i in paths:

        if i.endswith(".jpg"):
            continue

        id = str(uuid5(NAMESPACE_DNS, i))
        exists = seriesRoute.exists(id)

        if exists.data:
            continue

        series = Series(id=id, title=i, type="Series")
        seriesRoute.addSeries(series)

    print("Done")
