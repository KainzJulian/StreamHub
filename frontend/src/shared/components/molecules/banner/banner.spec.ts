import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Banner } from './banner';
import { MediaRouterService } from '../../../services/media-router.service';
import { MediaService } from '../../../services/media.service';
import { Media } from '../../../types/media';
import { signal } from '@angular/core';
import { mockEpisode, mockMovie, mockSeries } from '../../../mock/mock.data';
import { of } from 'rxjs';

describe('Banner', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  let mediaRouterServiceMock: jest.Mocked<MediaRouterService>;
  let mediaServiceMock: jest.Mocked<MediaService>;

  const currentMediaMock = signal<Media | null>(null);

  const testSeries = mockSeries;
  const testMovie = mockMovie;
  const testEpisode = mockEpisode;

  beforeEach(async () => {
    mediaRouterServiceMock = {
      openMediaPlayer: jest.fn(),
    } as unknown as jest.Mocked<MediaRouterService>;

    mediaServiceMock = {
      currentMedia: currentMediaMock,
      getSeries: jest.fn().mockReturnValue(
        of({
          data: mockSeries,
          success: true,
          error: '',
        })
      ),
    } as unknown as jest.Mocked<MediaService>;

    await TestBed.configureTestingModule({
      imports: [Banner],
      providers: [
        {
          provide: MediaService,
          useValue: mediaServiceMock,
        },
        {
          provide: MediaRouterService,
          useValue: mediaRouterServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit', () => {
    const movieSrcString = `/api/movies/${testMovie.id}/thumbnail_banner`;
    const seriesSrcString = `/api/series/${testSeries.id}/thumbnail_banner`;
    const episodeSrcString = `/api/episodes/${testEpisode.id}/thumbnail_banner`;

    it('should throw an Error when media id is null', () => {
      component.media = null;

      expect(() => fixture.detectChanges()).toThrow('Media ID not set');
    });

    it(`should set src to include the string ${movieSrcString}`, () => {
      component.media = testMovie;
      fixture.detectChanges();

      expect(component.src()).not.toBeNull();
      expect(component.src()).toContain(movieSrcString);
    });

    it(`should set src to include the string ${seriesSrcString}`, () => {
      component.media = testSeries;
      fixture.detectChanges();

      expect(component.src()).not.toBeNull();
      expect(component.src()).toContain(seriesSrcString);
    });

    it(`should set src to include the string ${episodeSrcString}`, () => {
      component.media = testEpisode;
      fixture.detectChanges();

      expect(component.src()).not.toBeNull();
      expect(component.src()).toContain(episodeSrcString);
    });

    it('should call mediaService getSeries when mediaType is "Episode" ', () => {
      component.media = testEpisode;
      fixture.detectChanges();

      expect(mediaServiceMock.getSeries).toHaveBeenCalledWith(
        testEpisode.seriesID
      );
    });
  });

  it('should set the currentMedia and call openMediaPlayer', () => {
    component.media = testMovie;
    fixture.detectChanges();
    component.playMedia();

    expect(mediaServiceMock.currentMedia()).toBe(testMovie);
    expect(mediaRouterServiceMock.openMediaPlayer).toHaveBeenCalledWith(
      testMovie
    );
  });

  describe('HTML rendering', () => {
    beforeEach(async () => {
      component.media = mockEpisode;
      fixture.detectChanges();
    });

    it('should render the thumbnail when src is not null', () => {
      jest.spyOn(component, 'src').mockReturnValue('URLtest');

      expect(component.src()).toBe('URLtest');

      const thumbnail = fixture.nativeElement.querySelector('.thumbnail');
      expect(thumbnail).toBeTruthy();
    });

    it('should not render the thumbnail when src is null', () => {});

    it('should render when media and seriesInfo is defined', () => {});

    it('should not render when media and seriesInfo is undefined', () => {});

    it('should render a complete circle if media is complete', () => {});

    it('should not render a complete circle if media is not complete', () => {});

    it('should render the rating if media rating is not null', () => {});

    it('should not render the rating if media rating is null', () => {});
  });
});
