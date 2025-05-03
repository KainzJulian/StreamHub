# StreamHub
This project is a private video streaming service built with FastAPI (Python), Angular (TypeScript), and MongoDB via Docker. It supports movies and series with episode thumbnails. 

## Requirements
- Docker & Docker Compose
- Python 3.10+
- Node.js & npm
- Angular CLI (npm install -g @angular/cli)


1. Start MongoDB with Docker:
```bash
docker-compose up -d
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

To access the application, open your web browser and navigate to `http://localhost:4200` for the frontend and `http://localhost:8000` for the backend API.


## Required Folder Structure for Media Path
The media files should be organized in the following structure for the application to work correctly:

```
media/
├── movies/
│   └── movieName/
│       ├── 1 - movieName1.mp4
│       ├── 1 - movieName1.jpg
│       ├── 2 - movieName2.mp4
│       ├── 2 - movieName2.jpg
└── series/
    └── seriesName/
        ├── 1/
        │   ├── 1 - episodeTitle1.mp4
        │   ├── 1 - episodeTitle1.jpg
        │   ├── 2 - episodeTitle2.mp4
        │   ├── 2 - episodeTitle2.jpg
```

The `.jpg` files are the thumbnails for the respective media files these files should be named the same as the media files but with a `.jpg` extension. The media files should be named in the format `episodeNumber - episodeTitle.mp4` for series and `orderNumber - movieName.mp4` for movies. The `orderNumber` is optional for movies but recommended for better organization. The
`episodeNumber` is optional but recommended otherwise the episode will not have an episode number. `episodeTitle` and `movieName` are mandatory for proper identification.
