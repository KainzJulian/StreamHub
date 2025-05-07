const BASE_URL = 'http://localhost:8000/api';

export const MovieRoutes = {
  MOVIES: `${BASE_URL}/movies`,
  MOVIE: (movieID: string) => `${BASE_URL}/movies/${movieID}/data`,

  THUMBNAIL: (movieID: string) => `${BASE_URL}/movies/${movieID}/thumbnail`,
  VIDEO: (movieID: string) => `${BASE_URL}/current_media/video/${movieID}`,
  PERCENT_WATCHED: (movieID: string) =>
    `${BASE_URL}/movies/${movieID}/percent_watched`,
};

export const SeriesRoutes = {
  SERIES_ALL: `${BASE_URL}/series`,
  SERIES: (seriesID: string) => `${BASE_URL}/series/${seriesID}/series`,

  THUMBNAIL: (seriesID: string) => `${BASE_URL}/series/${seriesID}/thumbnail`,
  PERCENT_WATCHED: (seriesID: string) =>
    `${BASE_URL}/series/${seriesID}/percent_watched`,
};

export const EpisodeRoutes = {
  Episodes: (seriesID: string) => `${BASE_URL}/episode?series_id=${seriesID}`,
  Episode: (episodeID: string) => `${BASE_URL}/episodes/${episodeID}/episode`,

  THUMBNAIL: (episodeID: string) =>
    `${BASE_URL}/episodes/${episodeID}/thumbnail`,
  VIDEO: (episodeID: string) => `${BASE_URL}/current_media/video/${episodeID}`,
  PERCENT_WATCHED: (episodeID: string) =>
    `${BASE_URL}/episodes/${episodeID}/percent_watched`,
};
