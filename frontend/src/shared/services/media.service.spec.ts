import { TestBed } from '@angular/core/testing';

import { MediaService } from './media.service';
import { HttpClient } from '@angular/common/http';
import {
  CurrentMediaRoutes,
  EpisodeRoutes,
  MediaRoutes,
  MovieRoutes,
  SeriesRoutes,
  WatchHistoryRoutes,
} from '../../utils/apiRoutes';
import {
  mockEpisode,
  mockMediaList,
  mockMediaTypeMovie,
  mockMovie,
  mockMovieList,
  mockSeries,
  mockSeriesList,
} from '../mock/mock.data';
import { of } from 'rxjs';
import { MediaGenre } from '../types/genre';

describe('MediaService', () => {
  let service: MediaService;
  let httpMock: jest.Mocked<HttpClient>;

  const testSeriesID: string = mockSeries.id;
  const testEpisodeID: string = mockEpisode.id;
  const testMovieID: string = mockMovie.id;

  const testMediaID: string = '742d33c6-c77f-4b87-bf0f-affe41dda40f';

  const testLimit: number = 10;

  const testSearchInput: string = 'test';
  const testSearchGenre: MediaGenre[] = mockSeries.genreList || [];

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        MediaService,
        {
          provide: HttpClient,
          useValue: httpMock,
        },
      ],
    }).compileComponents();

    service = TestBed.inject(MediaService);
  });

  describe('getMediaList', () => {
    it(`should call ${SeriesRoutes.SERIES_ALL}`, async () => {
      httpMock.get.mockReturnValue(of(mockSeriesList));

      service.getMediaList('series');

      expect(httpMock.get).toHaveBeenCalledWith(SeriesRoutes.SERIES_ALL);
    });

    it(`should call ${MovieRoutes.MOVIES}`, () => {
      httpMock.get.mockReturnValue(of(mockMovieList));

      service.getMediaList('movies');

      expect(httpMock.get).toHaveBeenCalledWith(MovieRoutes.MOVIES);
    });
  });

  it(`should call ${SeriesRoutes.SERIES(testSeriesID)}`, () => {
    httpMock.get.mockReturnValue(of(mockSeries));

    service.getSeries(testSeriesID);
    expect(httpMock.get).toHaveBeenCalledWith(
      SeriesRoutes.SERIES(testSeriesID)
    );
  });

  it(`should call ${EpisodeRoutes.EPISODE(testEpisodeID)}`, () => {
    httpMock.get.mockReturnValue(of(mockEpisode));

    service.getEpisode(testEpisodeID);
    expect(httpMock.get).toHaveBeenCalledWith(
      EpisodeRoutes.EPISODE(testEpisodeID)
    );
  });

  it(`should call ${MovieRoutes.MOVIE(testMovieID)}`, () => {
    httpMock.get.mockReturnValue(of(mockMovie));

    service.getMovie(testMovieID);
    expect(httpMock.get).toHaveBeenCalledWith(MovieRoutes.MOVIE(testMovieID));
  });

  it(`should call ${CurrentMediaRoutes.SET_CURRENT_MEDIA}`, () => {
    httpMock.post.mockReturnValue(of(null));

    service.setCurrentMedia(testMediaID);
    expect(httpMock.post).toHaveBeenCalledWith(
      CurrentMediaRoutes.SET_CURRENT_MEDIA,
      {
        mediaID: testMediaID,
      }
    );
  });

  it(`should call ${CurrentMediaRoutes.CURRENT_MEDIA}`, () => {
    httpMock.get.mockReturnValue(
      of({ type: 'movie', media: mockMediaTypeMovie })
    );

    service.getCurrentMedia();
    expect(httpMock.get).toHaveBeenCalledWith(CurrentMediaRoutes.CURRENT_MEDIA);
  });

  it(`should call ${MovieRoutes.HIGHEST_RATED(testLimit)}`, () => {
    httpMock.get.mockReturnValue(of(mockMovieList));

    service.getHighestRatedMovies(testLimit);
    expect(httpMock.get).toHaveBeenCalledWith(
      MovieRoutes.HIGHEST_RATED(testLimit)
    );
  });

  it(`should call ${SeriesRoutes.HIGHEST_RATED(testLimit)}`, () => {
    httpMock.get.mockReturnValue(of(mockSeriesList));

    service.getHighestRatedSeries(testLimit);
    expect(httpMock.get).toHaveBeenCalledWith(
      SeriesRoutes.HIGHEST_RATED(testLimit)
    );
  });

  it(`should call ${WatchHistoryRoutes.GET_HISTORY(testLimit)}`, () => {
    httpMock.get.mockReturnValue(of(mockMediaList));

    service.getWatchHistory(testLimit);
    expect(httpMock.get).toHaveBeenCalledWith(
      WatchHistoryRoutes.GET_HISTORY(testLimit)
    );
  });

  describe('addToWatchHistory for media type series, episodes and movies', () => {
    it(`should call ${WatchHistoryRoutes.ADD_HISTORY_ITEM(
      testMovieID,
      'Movie'
    )}`, () => {
      httpMock.post.mockReturnValue(of(mockMediaList));

      service.addToWatchHistory(mockMovie);
      expect(httpMock.post).toHaveBeenCalledWith(
        WatchHistoryRoutes.ADD_HISTORY_ITEM(testMovieID, 'Movie'),
        null
      );
    });

    it(`should call ${WatchHistoryRoutes.ADD_HISTORY_ITEM(
      testSeriesID,
      'Series'
    )}`, () => {
      httpMock.post.mockReturnValue(of(mockMediaList));

      service.addToWatchHistory(mockSeries);
      expect(httpMock.post).toHaveBeenCalledWith(
        WatchHistoryRoutes.ADD_HISTORY_ITEM(testSeriesID, 'Series'),
        null
      );
    });

    it(`should call ${WatchHistoryRoutes.ADD_HISTORY_ITEM(
      testEpisodeID,
      'Episode'
    )}`, () => {
      httpMock.post.mockReturnValue(of(mockMediaList));

      service.addToWatchHistory(mockEpisode);
      expect(httpMock.post).toHaveBeenCalledWith(
        WatchHistoryRoutes.ADD_HISTORY_ITEM(testEpisodeID, 'Episode'),
        null
      );
    });
  });

  it(`should call ${MediaRoutes.HIGHEST_RATED(testLimit)}`, () => {
    httpMock.get.mockReturnValue(of(mockMediaList));

    service.getHighestRated(testLimit);
    expect(httpMock.get).toHaveBeenCalledWith(
      MediaRoutes.HIGHEST_RATED(testLimit)
    );
  });

  it(`should call ${MediaRoutes.MEDIA(testEpisodeID)}`, () => {
    httpMock.get.mockReturnValue(of(mockEpisode));

    service.getMedia(testEpisodeID);
    expect(httpMock.get).toHaveBeenCalledWith(MediaRoutes.MEDIA(testEpisodeID));
  });

  it(`should call ${MediaRoutes.RANDOM_MEDIA_LIST(testLimit)}`, () => {
    httpMock.get.mockReturnValue(of(mockMediaList));

    service.getRandomMediaList(testLimit);
    expect(httpMock.get).toHaveBeenCalledWith(
      MediaRoutes.RANDOM_MEDIA_LIST(testLimit)
    );
  });

  it(`should call ${MovieRoutes.RANDOM(testLimit)}`, () => {
    httpMock.get.mockReturnValue(of(mockMediaList));

    service.getRandomMovie(testLimit);
    expect(httpMock.get).toHaveBeenCalledWith(MovieRoutes.RANDOM(testLimit));
  });

  it(`should call ${SeriesRoutes.RANDOM(testLimit)}`, () => {
    httpMock.get.mockReturnValue(of(mockMediaList));

    service.getRandomSeries(testLimit);
    expect(httpMock.get).toHaveBeenCalledWith(SeriesRoutes.RANDOM(testLimit));
  });

  it(`should call ${MediaRoutes.SEARCH(testSearchInput)}`, () => {
    httpMock.post.mockReturnValue(of(mockMediaList));

    service.getSearch(testSearchInput, testSearchGenre);
    expect(httpMock.post).toHaveBeenCalledWith(
      MediaRoutes.SEARCH(testSearchInput),
      testSearchGenre
    );
  });

  it(`should call ${MediaRoutes.GET_TIME_WATCHED(testEpisodeID)}`, () => {
    httpMock.get.mockReturnValue(of(100));

    service.getWatchTime(testEpisodeID);
    expect(httpMock.get).toHaveBeenCalledWith(
      MediaRoutes.GET_TIME_WATCHED(testEpisodeID)
    );
  });

  it(`should call ${MovieRoutes.GET_SIMILAR_MOVIES(testMovieID)}`, () => {
    httpMock.get.mockReturnValue(of(mockMovieList));

    service.getSimilarMovies(testMovieID);
    expect(httpMock.get).toHaveBeenCalledWith(
      MovieRoutes.GET_SIMILAR_MOVIES(testMovieID)
    );
  });

  it(`should call ${MediaRoutes.SET_TIME_WATCHED(testMovieID, 100)}`, () => {
    httpMock.post.mockReturnValue(of(true));

    service.setTime(testMovieID, 100);
    expect(httpMock.post).toHaveBeenCalledWith(
      MediaRoutes.SET_TIME_WATCHED(testMovieID, 100),
      null
    );
  });
});
