const BASE_URL = 'http://localhost:8000/api';

export const MovieRoutes = {
  MOVIES: `${BASE_URL}/movies`,
  MOVIE: (movieID: string) => `${BASE_URL}/movies/${movieID}/movie`,

  THUMBNAIL: (movieID: string) => `${BASE_URL}/movies/${movieID}/thumbnail`,
  PERCENT_WATCHED: (movieID: string) =>
    `${BASE_URL}/movies/${movieID}/percent_watched`,
  HIGHEST_RATED: (limit: number) => `${BASE_URL}/movies/highest_rated/${limit}`,
  RANDOM: (limit: number) => `${BASE_URL}/movies/random/${limit}`,
};

export const SeriesRoutes = {
  SERIES_ALL: `${BASE_URL}/series`,
  SERIES: (seriesID: string) => `${BASE_URL}/series/${seriesID}/series`,

  THUMBNAIL: (seriesID: string) => `${BASE_URL}/series/${seriesID}/thumbnail`,
  PERCENT_WATCHED: (seriesID: string) =>
    `${BASE_URL}/series/${seriesID}/percent_watched`,
  HIGHEST_RATED: (limit: number) => `${BASE_URL}/series/highest_rated/${limit}`,
  RANDOM: (limit: number) => `${BASE_URL}/series/random/${limit}`,
};

export const EpisodeRoutes = {
  Episodes: (seriesID: string) => `${BASE_URL}/episode?series_id=${seriesID}`,
  Episode: (episodeID: string) => `${BASE_URL}/episodes/${episodeID}/episode`,

  THUMBNAIL: (episodeID: string) =>
    `${BASE_URL}/episodes/${episodeID}/thumbnail`,
  PERCENT_WATCHED: (episodeID: string) =>
    `${BASE_URL}/episodes/${episodeID}/percent_watched`,
};

export const MediaRoutes = {
  MEDIA: (mediaID: string) => `${BASE_URL}/media/get/${mediaID}`,
  HIGHEST_RATED: (limit: number) =>
    `${BASE_URL}/media/highest_rated?limit=${limit}`,
  RANDOM_MEDIA_LIST: (limit: number) =>
    `${BASE_URL}/media/random_media/${limit}`,
  SEARCH: (input: string) => `${BASE_URL}/media/search/${input}`,
  SET_TIME_WATCHED: (mediaID: string, timeInSeconds: number) =>
    `${BASE_URL}/media/${mediaID}/time?time_in_seconds=${timeInSeconds}`,
  GET_TIME_WATCHED: (mediaID: string) =>
    `${BASE_URL}/media/${mediaID}/time_watched`,
  PUT_DATA: (mediaID: string) => `${BASE_URL}/media/${mediaID}/data`,
};

export const CurrentMediaRoutes = {
  CURRENT_MEDIA: `${BASE_URL}/current_media/get`,
  SET_CURRENT_MEDIA: `${BASE_URL}/current_media/`,
  GET_VIDEO: (media_id: string) =>
    `${BASE_URL}/current_media/video/${media_id}`,
};

export const WatchHistoryRoutes = {
  GET_HISTORY: (limit: number) => `${BASE_URL}/watch_history/${limit}`,
  ADD_HISTORY_ITEM: (id: string, type: string) =>
    `${BASE_URL}/watch_history/add/${id}?media_type=${type}`,
};
