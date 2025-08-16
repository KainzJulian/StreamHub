import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeCard } from './episode-card';
import { ActivatedRoute } from '@angular/router';
import { MediaRouterService } from '../../../services/media-router.service';
import { mockEpisode } from '../../../mock/mock.data';

describe('EpisodeCard', () => {
  let component: EpisodeCard;
  let fixture: ComponentFixture<EpisodeCard>;

  let mediaRouterServiceMock: jest.Mocked<MediaRouterService>;

  beforeEach(async () => {
    mediaRouterServiceMock = {
      openSeriesPlayer: jest.fn(),
    } as unknown as jest.Mocked<MediaRouterService>;

    await TestBed.configureTestingModule({
      imports: [EpisodeCard],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map([['seriesID', mockEpisode.seriesID]]),
            },
          },
        },
        {
          provide: MediaRouterService,
          useValue: mediaRouterServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EpisodeCard);
    component = fixture.componentInstance;

    component.episode = mockEpisode;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should throw an error if episode has no id', () => {
      component.episode = { ...mockEpisode, id: undefined as any };
      expect(() => component.ngOnInit()).toThrow('Episode ID not set');
    });

    it('should set the width of the progressBar to 50%', () => {
      component.episode = {
        ...mockEpisode,
        duration: 100,
        durationWatched: 50,
      };
      component.ngOnInit();
      expect(component.progressBarWidth()).toBe(50);
    });

    it('should set the style property --thumbnail-path', () => {
      fixture.detectChanges();
      const style = (fixture.nativeElement as HTMLElement).style;
      expect(style.getPropertyValue('--thumbnail-path')).toContain(
        `/api/episodes/${mockEpisode.id}/thumbnail_preview`
      );
    });
  });

  it('should check whether the media is in process or not', () => {
    component.progressBarWidth.set(10);
    expect(component.isInProgress()).toBeTruthy();

    component.progressBarWidth.set(101);
    expect(component.isInProgress()).not.toBeTruthy();

    component.progressBarWidth.set(0);
    expect(component.isInProgress()).not.toBeTruthy();
  });

  describe('clickButton', () => {
    it('should emit onClick when episode cards is clicked and call mediaRouterService.openSeriesPlayer', () => {
      fixture.detectChanges();

      jest.spyOn(component.onClick, 'emit');

      const card = fixture.nativeElement.querySelector('.card');

      card.click();

      expect(mediaRouterServiceMock.openSeriesPlayer).toHaveBeenCalledWith(
        mockEpisode.seriesID,
        mockEpisode.id
      );
    });

    it('should emit onClick when episode cards is clicked and call mediaRouterService.openSeriesPlayer with "" as seriesID', () => {
      jest.spyOn(component.onClick, 'emit');

      component.seriesID = null;
      fixture.detectChanges();

      const card = fixture.nativeElement.querySelector('.card');

      card.click();

      expect(mediaRouterServiceMock.openSeriesPlayer).toHaveBeenCalledWith(
        '',
        mockEpisode.id
      );
    });

    it('should not emit onClick when episode cards is clicked', () => {
      jest.spyOn(component.onClick, 'emit');

      component.episode = undefined;
      fixture.detectChanges();

      const card = fixture.nativeElement.querySelector('.card');

      card.click();

      expect(mediaRouterServiceMock.openSeriesPlayer).not.toHaveBeenCalled();
    });
  });

  describe('HTML rendering', () => {
    it('should render the progress bar', () => {
      component.progressBarWidth.set(50);
      fixture.detectChanges();

      const progress = fixture.nativeElement.querySelector('.card__progress');
      const progressBackground = fixture.nativeElement.querySelector(
        '.card__progress__background'
      );

      expect(progress).toBeTruthy();
      expect(progressBackground).toBeTruthy();
    });

    it('should not render the progress bar', () => {
      component.progressBarWidth.set(101);
      fixture.detectChanges();

      const progress = fixture.nativeElement.querySelector('.card__progress');
      const progressBackground = fixture.nativeElement.querySelector(
        '.card__progress__background'
      );

      expect(progress).toBeNull();
      expect(progressBackground).toBeNull();

      component.progressBarWidth.set(0);
      fixture.detectChanges();

      expect(progress).toBeNull();
      expect(progressBackground).toBeNull();
    });

    it('should render checkmark icon', () => {
      component.episode = { ...mockEpisode, watched: true };
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('.card__watched');

      expect(icon).toBeTruthy();
    });

    it('should not render checkmark icon', () => {
      component.episode = { ...mockEpisode, watched: false };
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('.card__watched');

      expect(icon).toBeNull();
    });
  });
});
