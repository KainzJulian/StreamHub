import { Component, ElementRef, Input, OnInit, signal } from '@angular/core';
import { Media } from '../../../types/media';
import { CommonModule } from '@angular/common';
import { MediaRouterService } from '../../../services/media-router.service';
import { MediaService } from '../../../services/media.service';
import { Movie } from '../../../types/movie';
import { Episode } from '../../../types/seriesEpisode';

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
    private elRef: ElementRef,
    private mediaRouterService: MediaRouterService,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    if (!this.media?.id) throw new Error('Media ID not set');

    let mediaType: 'movies' | 'series' | 'episodes' = 'series';

    if (this.media instanceof Movie && this.media.duration) {
      this.progressBarWidth.set(
        (this.media.durationWatched / this.media.duration) * 100
      );
      mediaType = 'movies';
    }

    if (this.media instanceof Episode) mediaType = 'episodes';

    this.elRef.nativeElement.style.setProperty(
      '--thumbnail-path',
      `url("http://localhost:8000/api/${mediaType}/${this.media?.id}/thumbnail_preview")`
    );
  }

  openPlayer() {
    if (!this.media) throw new Error('Media not set');

    this.mediaService.currentMedia.set(this.media);
    this.mediaRouterService.openMediaPlayer(this.media);
  }

  isInProgress(): boolean {
    return this.progressBarWidth() < 100 && this.progressBarWidth() > 0;
  }
}
