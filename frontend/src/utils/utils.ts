import { Genre } from '../shared/types/genre';
import { Media } from '../shared/types/media';

export const getMedia = (isSeries: boolean = false): Media => {
  return new Media({
    id: '1',
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    duration: 148,
    genreList: Object.values(Genre),
    pathMedia: '/assets/media/inception.jpg',
    rating: 90,
    isSeries: isSeries,
    season: null,
    episode: null,
    isComplete: false,
  });
};

export const getSeriesList = (length: number = 1): Media[] => {
  return getMediaList(length, true);
};

export const getMovieList = (length: number): Media[] => {
  return getMediaList(length);
};

export const getSeries = (): Media => {
  return getMedia(true);
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
