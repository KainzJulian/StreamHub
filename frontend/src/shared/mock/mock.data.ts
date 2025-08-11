import { MediaGenre } from '../types/genre';
import { Media } from '../types/media';
import { Movie } from '../types/movie';
import { Series } from '../types/series';
import { Episode } from '../types/seriesEpisode';
import { faker } from '@faker-js/faker';
import crypto from 'crypto';

export const getRandomBool = () => {
  return Math.random() > 0.5;
};

export const getRandomNumber = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomUUID = () => {
  return crypto.randomUUID();
};

export const getRandomMoviePath = () => {
  return `movies/${faker.word.noun()}/${faker.word.noun()}.mp4`;
};

export const getRandomSeriesPath = () => {
  return `movies/${faker.word.noun()}`;
};

export const getRandomEpisodePath = (
  series: string,
  season: number,
  episode: number
) => {
  return `series/${series}/${season}/${episode} - ${faker.word.noun()}.mp4`;
};

export const getRandomMovie = () => {
  const duration = getRandomNumber(100, 3000);

  return new Movie({
    description: faker.lorem.sentences(3),
    duration: duration,
    durationWatched: getRandomNumber(0, duration),
    genreList: [MediaGenre.ACTION, MediaGenre.ADVENTURE, MediaGenre.DRAMA],
    id: getRandomUUID(),
    isComplete: getRandomBool(),
    pathMedia: getRandomMoviePath(),
    rating: getRandomNumber(0, 100),
    title: faker.word.noun(),
    watched: getRandomBool(),
  });
};

export const getRandomSeries = () => {
  const duration = getRandomNumber(100, 3000);
  const title = faker.word.noun();
  const id = getRandomUUID();

  return new Series({
    description: faker.lorem.sentences(3),
    duration: duration,
    durationWatched: getRandomNumber(0, duration),
    id: id,
    genreList: [MediaGenre.ACTION, MediaGenre.ADVENTURE, MediaGenre.DRAMA],
    isComplete: getRandomBool(),
    rating: getRandomNumber(0, 100),
    title: title,
    watched: getRandomBool(),
    episodeList: getRandomEpisodeList(1, 10, 1, 4, id, title),
  });
};

export const getRandomEpisode = (
  episode: number,
  season: number,
  seriesName: string,
  seriesID: string
) => {
  const duration = getRandomNumber(100, 3000);

  return new Episode({
    description: faker.lorem.sentences(3),
    duration: duration,
    durationWatched: getRandomNumber(0, duration),
    id: getRandomUUID(),
    isComplete: getRandomBool(),
    rating: getRandomNumber(0, 100),
    title: faker.word.noun(),
    watched: getRandomBool(),
    episode: episode,
    season: season,
    pathMedia: getRandomEpisodePath(seriesName, season, episode),
    seriesID: seriesID,
  });
};

export const getRandomEpisodeList = (
  minEpisodesPerSeason: number,
  maxEpisodesPerSeason: number,
  minSeasons: number,
  maxSeasons: number,
  seriesID: string,
  seriesName: string
) => {
  const episodeList: Episode[] = [];

  if (minEpisodesPerSeason < 0) minEpisodesPerSeason = 1;

  for (let i = 0; i < getRandomNumber(minSeasons, maxSeasons); i++) {
    const numberOfEpisodes = getRandomNumber(
      minEpisodesPerSeason,
      maxEpisodesPerSeason
    );

    for (let j = 0; j < numberOfEpisodes; j++) {
      episodeList.push(getRandomEpisode(j, i, seriesName, seriesID));
    }
  }

  return episodeList;
};

export const mockEpisodeList: Episode[] = [];
export const mockSeriesList: Series[] = [];
export const mockMovieList: Movie[] = [];

export const mockSeries: Series = new Series(getRandomSeries());
export const mockMovie: Movie = new Movie(getRandomMovie());
export const mockEpisode: Episode = new Episode(
  getRandomEpisode(1, 1, mockSeries.title || faker.word.noun(), mockSeries.id)
);

export const mockMediaList: Media[] = [];

export const mockMediaTypeMovie: Media = new Movie({});
export const mockMediaTypeSeries: Media = new Series({});
