import { Component, Input, OnInit, signal } from '@angular/core';
import { Media } from '../../../types/media';
import { CommonModule } from '@angular/common';
import { MediaRouterService } from '../../../services/media-router.service';
import { MediaService } from '../../../services/media.service';
import { Movie } from '../../../types/movie';

@Component({
  selector: 'media-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss',
})
export class MediaCard implements OnInit {
  @Input() media: Media | null = null;

  public progressBarWidth = signal<number>(0);

  constructor(
    private mediaRouterService: MediaRouterService,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    if (this.media instanceof Movie && this.media.duration)
      this.progressBarWidth.set(
        (this.media.durationWatched / this.media.duration) * 100
      );
  }

  openPlayer() {
    if (this.media) {
      this.mediaService.currentMedia.set(this.media);
      this.mediaRouterService.openMediaPlayer(this.media);
    }
  }

  isInProgress(): boolean {
    return this.progressBarWidth() < 100 && this.progressBarWidth() > 0;
  }
}
