import os


def getENV(env_name: str) -> str:

    name = os.getenv(env_name)

    if name == None:
        raise Exception(env_name + " not found in the .env file")

    return name
