import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MediaRoutes } from '../../../../utils/apiRoutes';
import { Media } from '../../../types/media';
import { MediaService } from '../../../services/media.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'media-template',
  standalone: true,
  imports: [],
  templateUrl: './media-template.html',
  styleUrl: './media-template.scss',
})
export class MediaTemplate implements OnInit, OnDestroy {
  @Input() videoSource?: string;
  @Input() media: Media | null = null;

  @ViewChild('video', { static: true }) video?: ElementRef<HTMLVideoElement>;

  isPlaying = false;

  routeSub!: Subscription;

  constructor(
    private mediaService: MediaService,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(() => {
      this.onPauseVideo();
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload() {
    this.onPauseVideo();
    return true;
  }

  onPauseVideo() {
    const time = this.video?.nativeElement.currentTime;
    const id = this.media?.id;
    if (id && time)
      navigator.sendBeacon(MediaRoutes.SET_TIME_WATCHED(id, Math.floor(time)));
  }

  onPlayVideo() {
    if (!this.media) return;
    this.mediaService.addToWatchHistory(this.media);
    this.mediaService.setCurrentMedia(this.media.id);
  }

  onLoadMetadata() {
    this.mediaService.getWatchTime(this.media?.id)?.subscribe((response) => {
      if (this.video) this.video.nativeElement.currentTime = response.data;
    });
  }

  togglePlay(): void {
    if (this.video) {
      if (this.isPlaying) {
        this.video.nativeElement.pause();
      } else {
        this.video.nativeElement.play();
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  toggleFullscreen(): void {
    const video = this.video?.nativeElement;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  }

  stepFrame(direction: number) {
    const video = this.video?.nativeElement;
    if (!video) return;
    if (!video.paused) video.pause();
    const frameTime = 1 / 23.98;
    video.currentTime += direction * frameTime;
  }

  seek(seconds: number) {
    const video = this.video?.nativeElement;
    if (!video) return;
    video.currentTime += seconds;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const tag = target.tagName.toLowerCase();

    if (tag === 'input' || tag === 'textarea' || target.isContentEditable)
      return;

    switch (event.key) {
      case 'MediaPlayPause':
      case ' ':
        event.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.seek(5);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.seek(-5);
        break;
      case 'f':
        event.preventDefault();
        this.toggleFullscreen();
        break;
      case ',':
        event.preventDefault();
        this.stepFrame(-1);
        break;
      case '.':
        event.preventDefault();
        this.stepFrame(1);
        break;
    }
  }
}
