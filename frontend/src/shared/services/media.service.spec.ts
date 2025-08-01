import { TestBed } from '@angular/core/testing';

import { MediaService } from './media.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpRequestHandler } from '../types/APIMethodService';
import { MovieRoutes, SeriesRoutes } from '../../utils/apiRoutes';
import { Series } from '../types/series';
import { mockSeriesList } from '../mock/mock.data';
import { of } from 'rxjs';

describe('MediaService', () => {
  let service: MediaService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(withInterceptorsFromDi()),
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
    it(`should call ${SeriesRoutes.SERIES_ALL}`, () => {
      httpMock.get.mockReturnValue(of(mockSeriesList));

      service.getMediaList('series').subscribe((result) => {
        expect(httpMock.get).toHaveBeenCalledWith('/api/series');
        expect(result).toEqual([]);
      });
    });

    it(`should call ${MovieRoutes.MOVIES}`, () => {});
  });
});
