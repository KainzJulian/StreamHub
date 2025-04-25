from dotenv import load_dotenv
import pymongo

from utils.get_env import getENV


load_dotenv()

client = pymongo.MongoClient(getENV("MONGO_URI"))
client._connect()

database = client[getENV("DATABASE_NAME")]

watchHistoryCollection = database[getENV("WATCH_HISTORY_COLLECTION")]
currentMediaCollection = database[getENV("CURRENT_MEDIA_COLLECTION")]

seriesCollection = database[getENV("SERIES_COLLECTION")]
movieCollection = database[getENV("MOVIE_COLLECTION")]
episodesCollection = database[getENV("EPISODES_COLLECTION")]
