import { mockEpisode, mockMovie, mockSeries } from '../mock/mock.data';
import { LibraryListType } from '../types/libraryListType';
import { MediaRouterService } from './media-router.service';
import { Router } from '@angular/router';

describe('MediaRouterService', () => {
  let service: MediaRouterService;
  let routerMock: jest.Mocked<Router>;

  const testEpisode = mockEpisode;
  const testMovie = mockMovie;
  const testSeries = mockSeries;

  const testInput = 'test Input';

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    service = new MediaRouterService(routerMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openMediaPlayer', () => {
    it(`should navigate to the route /series/${testEpisode.seriesID}/player`, () => {
      service.openMediaPlayer(testEpisode);

      expect(routerMock.navigate).toHaveBeenCalledWith([
        `/series/${testEpisode.seriesID}/player`,
        testEpisode.id,
      ]);
    });

    it(`should navigate to the route /series`, () => {
      service.openMediaPlayer(testSeries);

      expect(routerMock.navigate).toHaveBeenCalledWith([
        '/series',
        testSeries.id,
      ]);
    });

    it(`should navigate to the route /movie/player`, () => {
      service.openMediaPlayer(testMovie);

      expect(routerMock.navigate).toHaveBeenCalledWith([
        `/movie/player`,
        testMovie.id,
      ]);
    });
  });

  it(`should navigate to the route /series/${testEpisode.seriesID}/player`, () => {
    service.openSeriesPlayer(testEpisode.seriesID, testEpisode.id);

    expect(routerMock.navigate).toHaveBeenCalledWith([
      `/series/${testEpisode.seriesID}/player`,
      testEpisode.id,
    ]);
  });

  it(`should navigate to the route /movie/player`, () => {
    service.openMoviePlayer(testMovie.id);

    expect(routerMock.navigate).toHaveBeenCalledWith([
      `/movie/player`,
      testMovie.id,
    ]);
  });

  it(`should navigate to the route /search`, () => {
    service.openSearch('test Input');

    expect(routerMock.navigate).toHaveBeenCalledWith([`/search`, 'test Input']);
  });

  it(`should navigate to the route /edit`, () => {
    service.openEditPage(testEpisode.id);

    expect(routerMock.navigate).toHaveBeenCalledWith([`/edit`, testEpisode.id]);
  });

  it.each<LibraryListType>([
    'highRated',
    'movies',
    'moviesSeries',
    'recWatched',
    'series',
  ])(`should navigate to the route /library with type %s`, (type) => {
    service.openLibraryPage(type);

    expect(routerMock.navigate).toHaveBeenCalledWith([`/library`, type]);
  });
});
