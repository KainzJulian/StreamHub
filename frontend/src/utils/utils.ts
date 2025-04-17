import { Genre } from '../shared/types/genre';
import { Media } from '../shared/types/media';
import { Movie } from '../shared/types/movie';
import { Episode, Series } from '../shared/types/series';

export const getMedia = (isSeries: boolean = false): Media => {
  if (!isSeries) {
    const title = movieTitles[getRandomInt(0, movieTitles.length)];

    return new Movie({
      id: title,
      title: title,
      description:
        'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.',
      genreList: getRandomGenres(),
      rating: 87,
      duration: 144,
      pathMedia: 'This is the path',
      isComplete: true,
    });
  }

  const title = movieTitles[getRandomInt(0, movieTitles.length)];

  return new Series({
    id: title,
    title: title,
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    genreList: getRandomGenres(),
    rating: 90,
    isComplete: false,
    episodeList: getRandomEpisodes(4, 5, 20),
  });
};

export const getSeriesList = (length: number = 1): Media[] => {
  return getMediaList(length, true);
};

export const getMovieList = (length: number): Media[] => {
  return getMediaList(length);
};

export const getSeries = (): Series => {
  return getMedia(true) as Series;
};

export const getMovie = (): Media => {
  return getMedia();
};

export const getMediaList = (
  length: number = 1,
  isSeries: boolean = false
): Media[] => {
  const list = [];

  for (let index = 0; index < length; index++) {
    list.push(getMedia(isSeries));
  }

  return list;
};

const getRandomEpisodes = (
  seasons: number,
  episodesMin: number,
  episodesMax: number
): Episode[] => {
  const episodes: Episode[] = [];

  for (let i = 0; i < seasons; i++) {
    for (let j = 0; j < getRandomInt(episodesMin, episodesMax); j++) {
      const episodeName = episodeTitles[getRandomInt(0, episodeTitles.length)];
      episodes.push(
        new Episode({
          id: episodeName,
          episode: j + 1,
          season: i + 1,
          title: episodeName,
        })
      );
    }
  }

  return episodes;
};

const getRandomGenres = (): Genre[] => {
  const genres = Object.values(Genre);
  const randomGenres: Genre[] = [];

  const numberOfGenres = getRandomInt(1, genres.length);

  for (let i = 0; i < numberOfGenres; i++) {
    const randomGenre = genres[getRandomInt(0, genres.length - 1)];
    if (!randomGenres.includes(randomGenre)) {
      randomGenres.push(randomGenre);
    }
  }

  return randomGenres;
};

const movieTitles: string[] = [
  'The Matrix',
  'Inception',
  'Interstellar',
  'The Dark Knight',
  'Pulp Fiction',
  'The Shawshank Redemption',
  'Fight Club',
  'Forrest Gump',
  'The Godfather',
  'The Lord of the Rings',
  'The Empire Strikes Back',
  'The Avengers',
  'Jurassic Park',
  'The Lion King',
  'Titanic',
  'Gladiator',
  'The Silence of the Lambs',
  "Schindler's List",
  'The Departed',
  'The Prestige',
  'The Social Network',
  'The Grand Budapest Hotel',
  'Mad Max: Fury Road',
  'The Revenant',
  'The Wolf of Wall Street',
  'Django Unchained',
  'The Hateful Eight',
  'The Irishman',
  'Parasite',
  'Everything Everywhere All At Once',
];

const episodeTitles: string[] = [
  'The Beginning',
  'A New Dawn',
  'Shadows Rising',
  'The Lost Artifact',
  'Echoes of the Past',
  'The Reckoning',
  'Into the Abyss',
  'The Final Stand',
  'Whispers in the Dark',
  'The Betrayal',
  'The Forgotten Realm',
  'Rise of the Phoenix',
  'The Silent Watcher',
  'The Crimson Tide',
  'The Shattered Crown',
  'The Eternal Flame',
  'The Hidden Truth',
  'The Last Hope',
  'The Iron Fortress',
  'The Frozen Wasteland',
  'The Golden Compass',
  'The Dark Prophecy',
  'The Mystic Forest',
  'The Celestial Gate',
  'The Endless Journey',
  'The Fallen Star',
  'The Secret Alliance',
  'The Storm Within',
  'The Vanishing Point',
  'The Final Hour',
];

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
