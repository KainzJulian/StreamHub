import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
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
export class MediaCard implements OnChanges {
  @Input() media: Media | null = null;

  public progressBarWidth = signal<number>(0);

  constructor(
    private elRef: ElementRef,
    private mediaRouterService: MediaRouterService,
    private mediaService: MediaService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['media']) this.setThumbnailPath();
  }

  private setThumbnailPath() {
    if (!this.media?.id) throw new Error('Media ID not set');

    let mediaType: 'movies' | 'series' | 'episodes' = 'series';

    if (this.media instanceof Movie) {
      mediaType = 'movies';
      this.updateProgressBar(this.media.durationWatched, this.media.duration);
    }

    if (this.media instanceof Episode) {
      mediaType = 'episodes';
      this.updateProgressBar(this.media.durationWatched, this.media.duration);
    }

    this.elRef.nativeElement.style.setProperty(
      '--thumbnail-path',
      `url("http://localhost:8000/api/${mediaType}/${this.media?.id}/thumbnail_preview")`
    );
  }

  private updateProgressBar(durationWatched: number, duration: number) {
    this.progressBarWidth.set((durationWatched / duration) * 100);
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
