import { MediaGenre } from '../types/genre';
import { Media } from '../types/media';
import { Movie } from '../types/movie';
import { Series } from '../types/series';
import { Episode } from '../types/seriesEpisode';
import { faker } from '@faker-js/faker';

export const mockEpisodeList: Episode[] = [];
export const mockSeriesList: Series[] = [];
export const mockMovieList: Movie[] = [];

export const mockEpisode: Episode = new Episode({});
export const mockSeries: Series = new Series({});
export const mockMovie: Movie = new Movie({});

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

  return new Series({
    description: faker.lorem.sentences(3),
    duration: duration,
    durationWatched: getRandomNumber(0, duration),
    id: getRandomUUID(),
    genreList: [MediaGenre.ACTION, MediaGenre.ADVENTURE, MediaGenre.DRAMA],
    isComplete: getRandomBool(),
    rating: getRandomNumber(0, 100),
    title: faker.word.noun(),
    watched: getRandomBool(),
  });
};

export const getRandomEpisode = () => {
  return new Episode({});
};
