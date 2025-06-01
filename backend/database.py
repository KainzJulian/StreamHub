from dotenv import load_dotenv
import pymongo
import pymongo.collection
import pymongo.database

from utils.get_env import getENV


def getCollectionFromName(
    name: str, database: pymongo.database.Database
) -> pymongo.collection.Collection:
    if name in database.list_collection_names():
        return database[name]
    else:
        return database.create_collection(name)


load_dotenv()

client = pymongo.MongoClient(getENV("MONGO_URI"))
client._connect()

database = client[getENV("DATABASE_NAME")]

watchHistoryCollection = getCollectionFromName(
    getENV("WATCH_HISTORY_COLLECTION"), database
)
currentMediaCollection = getCollectionFromName(
    getENV("CURRENT_MEDIA_COLLECTION"), database
)

seriesCollection = getCollectionFromName(getENV("SERIES_COLLECTION"), database)
movieCollection = getCollectionFromName(getENV("MOVIE_COLLECTION"), database)
episodesCollection = getCollectionFromName(getENV("EPISODES_COLLECTION"), database)
