import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { BaseButton } from '../../atoms/base-button/base-button';
import { Media } from '../../../types/media';
import { CommonModule } from '@angular/common';
import { MediaRouterService } from '../../../services/media-router.service';
import { GenreList } from '../genre-list/genre-list';
import { MediaService } from '../../../services/media.service';
import { Series } from '../../../types/series';
import { Episode } from '../../../types/seriesEpisode';

@Component({
  selector: 'banner',
  standalone: true,
  imports: [BaseButton, CommonModule, GenreList],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
})
export class Banner implements AfterViewInit {
  @Input() media: Media | null = null;

  public seriesInfo: Series | null = null;

  @ViewChild('img') img!: ElementRef;

  public src = signal<string | null>(null);

  constructor(
    private elRef: ElementRef,
    private mediaRouterService: MediaRouterService,
    private mediaService: MediaService
  ) {}

  ngAfterViewInit(): void {
    if (!this.media?.id) throw new Error('Media ID not set');

    const mediaType = this.media.type;
    let type = '';

    if (mediaType == 'Movie') type = 'movies';
    if (mediaType == 'Series') type = 'series';
    if (mediaType == 'Episode') {
      type = 'episodes';
      if (this.media instanceof Episode) {
        this.mediaService
          .getSeries(this.media.seriesID)
          .subscribe(
            (response) => (this.seriesInfo = new Series(response.data))
          );
      }
    }
    this.src.set(
      `http://localhost:8000/api/${type}/${this.media?.id}/thumbnail_banner`
    );

    // this.elRef.nativeElement.style.setProperty(
    //   '--thumbnail-path',
    //   `url("http://localhost:8000/api/${type}/${this.media?.id}/thumbnail_banner")`
    // );
  }

  playMedia() {
    if (this.media == null) return;

    this.mediaService.currentMedia.set(this.media);
    this.mediaRouterService.openMediaPlayer(this.media);
  }

  isEpisode(): boolean {
    return this.media instanceof Episode;
  }

  getMediaAsEpisode(): Episode | null {
    if (this.media instanceof Episode) return new Episode(this.media);
    return null;
  }
}
