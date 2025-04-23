from fastapi import APIRouter, UploadFile, File, HTTPException

fileRouter = APIRouter(prefix="/file")


@fileRouter.post("/upload/")
async def upload_file():
    return "test2"
