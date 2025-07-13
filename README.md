
# StreamHub

This project is a private video streaming service built with FastAPI (Python), Angular (TypeScript), and MongoDB via Docker. It supports movies and series with episode thumbnails.

## TechStack

- **Backend**: FastAPI (Python)
- **Frontend**: Angular (TypeScript)
- **Database**: MongoDB via Docker

## Requirements

- Docker & Docker Compose
- Python 3.10+
- Node.js & npm
- Angular CLI (npm install -g @angular/cli)

1. Start MongoDB with Docker:

```bash
npm run mongo
```

2. Install Python dependencies:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Install Angular dependencies:

```bash
cd frontend
npm install
```

4. Copy the `.env.example` file to `.env` in the backend directory and fill in the required values.

```bash
cp .env.example .env
```

5. Run the backend server:

```bash
npm run backend
```

6. Run the frontend server:

```bash
npm run frontend
```

To access the application, open your web browser and navigate to `http://10.0.0.5:4200` for the frontend and `http://10.0.0.5:4201` for the backend API.

## Required Folder Structure for Media Path

The media files should be organized in the following structure for the application to work correctly:

``` text
media/
├── movies/
│   ├── movieName.jpg
│   └── movieName/
│       ├── 1 - movieName1.mp4
│       ├── 1 - movieName1.jpg
│       ├── 2 - movieName2.mp4
│       ├── 2 - movieName2.jpg
└── series/
    ├── seriesName.jpg
    └── seriesName/
        ├── 1/
        │   ├── 1 - episodeTitle1.mp4
        │   ├── 1 - episodeTitle1.jpg
        │   ├── 2 - episodeTitle2.mp4
        │   ├── 2 - episodeTitle2.jpg
```

The `.jpg` files are the thumbnails for the respective media files these files have to be named the same as the media files but with a `.jpg` extension. Same is for series and movie thumbnails. If no thumbnail is present, the application will search for the thumbnail of the movie or series in the parent directory. If no thumbnail is found, the application will not display a thumbnail for that media.

The media files should be named in the format `episodeNumber - episodeTitle.mp4` for series and `orderNumber - movieName.mp4` for movies. The `orderNumber` and `episodeNumber` are optional but recommended for better organization. If no `episodeNumber` is present, the episode will not have an episode number. `episodeTitle` and `movieName` are mandatory for proper identification.

### Notes

If the episode does not have a thumbnail, the series thumbnail will be used as a fallback. If the series thumbnail is also missing, there will be no thumbnail for the episode.

## Features

- Movie and series streaming with thumbnails.
- Thumbnail support
- Video playback
- Season and episode grouping for series

## Known Issues or Limitations

- The application does not currently support subtitles or multiple audio tracks for the media files.
- Only `.mp4` video files are supported.
- Only `.jpg` image files are supported for thumbnails.
- Requires specific folder structure for media files to work correctly.
- The application is designed for personal use and may not be suitable for production environments without further enhancements and security measures.

## MIT License

Copyright (c) 2025 KainzJulian

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, IN AN ACTION OF CONTRACT, OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
