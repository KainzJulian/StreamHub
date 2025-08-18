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

    it('should ', () => {});
  });
});
