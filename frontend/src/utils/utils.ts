import { Genre } from '../shared/types/genre';
import { Media } from '../shared/types/media';
import { Movie } from '../shared/types/movie';
import { Episode, Series } from '../shared/types/series';

export const getMedia = (isSeries: boolean = false): Media => {
  if (!isSeries)
    return new Movie({
      id: 'The Matrix',
      title: 'The Matrix',
      description:
        'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.',
      genreList: [Genre.ACTION, Genre.SCIFI],
      rating: 87,
      duration: 144,
      pathMedia: 'This is the path',
      isComplete: true,
    });

  return new Series({
    id: 'the Matrix',
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    genreList: Object.values(Genre),
    rating: 90,
    isComplete: false,
    episodeList: [
      new Episode({ season: 1, episode: 1, title: 'the Episode1 S1' }),
      new Episode({ season: 1, episode: 2, title: 'the Episode2 S1' }),
      new Episode({ season: 1, episode: 3, title: 'the Episode2 S1' }),
      new Episode({ season: 1, episode: 4, title: 'the Episode2 S1' }),
      new Episode({ season: 1, episode: 5, title: 'the Episode2 S1' }),
      new Episode({ season: 1, episode: 6, title: 'the Episode2 S1' }),
      new Episode({ season: 1, episode: 7, title: 'the Episode 1 S2' }),
      new Episode({ season: 1, episode: 8, title: 'the Episode 2 S2' }),
      new Episode({ season: 1, episode: 9, title: 'the Episode 1 S2' }),
      new Episode({ season: 1, episode: 10, title: 'the Episode 2 S2' }),
      new Episode({ season: 1, episode: 11, title: 'the Episode 1 S2' }),
      new Episode({ season: 1, episode: 12, title: 'the Episode 2 S2' }),
      new Episode({ season: 1, episode: 13, title: 'the Episode 1 S2' }),
      new Episode({ season: 1, episode: 14, title: 'the Episode 2 S2' }),
      new Episode({ season: 1, episode: 15, title: 'the Episode1 S3' }),
      new Episode({ season: 1, episode: 16, title: 'the Episode2 S3' }),
      new Episode({ season: 2, episode: 1, title: 'the Episode1 S3' }),
      new Episode({ season: 2, episode: 2, title: 'the Episode2 S3' }),
      new Episode({ season: 2, episode: 3, title: 'the Episode1 S3' }),
      new Episode({ season: 2, episode: 4, title: 'the Episode2 S3' }),
      new Episode({ season: 2, episode: 5, title: 'the Episode1 S3' }),
      new Episode({ season: 2, episode: 6, title: 'the Episode2 S3' }),
      new Episode({ season: 2, episode: 7, title: 'the Episode1 S3' }),
      new Episode({ season: 2, episode: 8, title: 'the Episode2 S3' }),
      new Episode({ season: 2, episode: 9, title: 'the Episode1 S3' }),
      new Episode({ season: 2, episode: 10, title: 'the Episode2 S3' }),
      new Episode({ season: 2, episode: 11, title: 'the Episode1 S3' }),
      new Episode({ season: 2, episode: 12, title: 'the Episode2 S3' }),
      new Episode({ season: 2, episode: 13, title: 'the Episode1 S3' }),
      new Episode({ season: 2, episode: 14, title: 'the Episode2 S3' }),
      new Episode({ season: 3, episode: 1, title: 'the Episode1 S3' }),
      new Episode({ season: 3, episode: 2, title: 'the Episode2 S3' }),
      new Episode({ season: 3, episode: 3, title: 'the Episode1 S3' }),
      new Episode({ season: 3, episode: 4, title: 'the Episode2 S3' }),
      new Episode({ season: 3, episode: 5, title: 'the Episode1 S3' }),
      new Episode({ season: 3, episode: 6, title: 'the Episode2 S3' }),
      new Episode({ season: 4, episode: 1, title: 'the Episode2 S3' }),
    ],
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
