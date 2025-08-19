import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCard } from './media-card';
import { MediaRouterService } from '../../../services/media-router.service';
import { MediaService } from '../../../services/media.service';
import { Media } from '../../../types/media';
import { signal } from '@angular/core';
import { mockMovie } from '../../../mock/mock.data';

describe('MediaCard', () => {
  let component: MediaCard;
  let fixture: ComponentFixture<MediaCard>;

  let mediaRouterServiceMock: jest.Mocked<MediaRouterService>;
  let mediaServiceMock: jest.Mocked<MediaService>;

  const currentMediaMock = signal<Media | null>(null);

  beforeEach(async () => {
    mediaRouterServiceMock = {
      openMediaPlayer: jest.fn(),
    } as unknown as jest.Mocked<MediaRouterService>;

    mediaServiceMock = {
      currentMedia: currentMediaMock,
    } as unknown as jest.Mocked<MediaService>;

    await TestBed.configureTestingModule({
      imports: [MediaCard],
      providers: [
        {
          provide: MediaRouterService,
          useValue: mediaRouterServiceMock,
        },
        {
          provide: MediaService,
          useValue: mediaServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaCard);
    component = fixture.componentInstance;

    component.media = mockMovie;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openPlayer', () => {
    it('should throw an Error: Media not set', () => {
      component.media = null;
      fixture.detectChanges();

      expect(() => component.openPlayer()).toThrow('Media not set');
    });

    it('should set currentMedia and call openMediaPlayer', () => {
      fixture.detectChanges();
      component.openPlayer();

      expect(mediaServiceMock.currentMedia()).toBe(component.media);
      expect(mediaRouterServiceMock.openMediaPlayer).toHaveBeenCalledWith(
        component.media
      );
    });
  });

  describe('isInProgress', () => {
    it.each([
      [-1, false],
      [0, false],
      [50, true],
      [100, false],
      [120, false],
    ])('should return %i when progressBarWidth is %o', (width, expected) => {
      component.progressBarWidth.set(width);
      expect(component.isInProgress()).toBe(expected);
    });
  });

  describe('HTML rendering', () => {
    it('should render selected class when isSelected is true', () => {
      component.isSelected = true;
      fixture.detectChanges();

      const thumbnail = fixture.nativeElement.querySelector('.selected');
      expect(thumbnail).not.toBeNull();
    });

    it('should not render selected class when isSelected is false', () => {
      component.isSelected = false;
      fixture.detectChanges();

      const thumbnail = fixture.nativeElement.querySelector('.selected');
      expect(thumbnail).toBeNull();
    });

    it('should render rating when it is not null', () => {
      component.media = { ...mockMovie, rating: 30 };
      fixture.detectChanges();

      const rating = fixture.nativeElement.querySelector('.card__rating');
      expect(rating).not.toBeNull();
    });

    it('should not render rating when it is null', () => {
      component.media = { ...mockMovie, rating: null };
      fixture.detectChanges();

      const rating = fixture.nativeElement.querySelector('.card__rating');
      expect(rating).toBeNull();
    });

    it('should not render an indicator circle when the media is complete', () => {
      component.media = { ...mockMovie, isComplete: true };
      fixture.detectChanges();

      const rating = fixture.nativeElement.querySelector(
        '.card__complete.circle'
      );
      expect(rating).toBeNull();
    });

    it('should render an indicator circle when the media is complete', () => {
      component.media = { ...mockMovie, isComplete: false };
      fixture.detectChanges();

      const rating = fixture.nativeElement.querySelector(
        '.card__complete.circle'
      );
      expect(rating).not.toBeNull();
    });

    it('should render card progress and the background when it is in progress', () => {
      jest.spyOn(component, 'isInProgress').mockReturnValue(true);
      fixture.detectChanges();

      const cardProgressBackground = fixture.nativeElement.querySelector(
        '.card__progress.card__progress__background'
      );
      expect(cardProgressBackground).not.toBeNull();

      const cardProgress =
        fixture.nativeElement.querySelector('.card__progress');
      expect(cardProgress).not.toBeNull();
    });

    it('should not render card progress and the background when it is in progress', () => {
      jest.spyOn(component, 'isInProgress').mockReturnValue(false);
      fixture.detectChanges();

      const cardProgressBackground = fixture.nativeElement.querySelector(
        '.card__progress.card__progress__background'
      );
      expect(cardProgressBackground).toBeNull();

      const cardProgress =
        fixture.nativeElement.querySelector('.card__progress');
      expect(cardProgress).toBeNull();
    });

    it('should render a checkmark when the media is watched', () => {
      component.media = { ...mockMovie, watched: true };
      fixture.detectChanges();

      const cardWatched = fixture.nativeElement.querySelector('.card__watched');
      expect(cardWatched).not.toBeNull();
    });

    it('should render a checkmark when the media is watched', () => {
      component.media = { ...mockMovie, watched: false };
      fixture.detectChanges();

      const cardWatched = fixture.nativeElement.querySelector('.card__watched');
      expect(cardWatched).toBeNull();
    });
  });
});
