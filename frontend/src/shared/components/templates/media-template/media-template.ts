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

  constructor(private mediaService: MediaService) {}

  setTimeOfVideo() {
    this.mediaService.getWatchTime(this.media?.id)?.subscribe((response) => {
      console.log(response);

      if (this.video) this.video.nativeElement.currentTime = response.data;
    });
  }

  ngOnDestroy(): void {
    window.addEventListener('beforeunload', this.saveTime);
  }

  ngOnInit(): void {
    window.addEventListener('beforeunload', this.saveTime);
  }

  saveTime() {
    const time = this.video?.nativeElement.currentTime;
    const id = this.media?.id;
    if (id && time)
      navigator.sendBeacon(MediaRoutes.SET_TIME_WATCHED(id, Math.floor(time)));
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
    event.preventDefault();

    switch (event.key) {
      case ' ':
        event.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowRight':
        this.seek(5);
        break;
      case 'ArrowLeft':
        this.seek(-5);
        break;
      case 'f':
        this.toggleFullscreen();
        break;
      case ',':
        this.stepFrame(-1);
        break;
      case '.':
        this.stepFrame(1);
        break;
    }
  }
}
