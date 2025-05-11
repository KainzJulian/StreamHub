import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Media } from '../types/media';
import { Episode, Series } from '../types/series';
import { Movie } from '../types/movie';
import { MediaService } from './media.service';

@Injectable({
  providedIn: 'root',
})
export class MediaRouterService {
  private route: string = '';

  constructor(private router: Router, private mediaService: MediaService) {}

  public openMediaPlayer(media: Media) {
    const route = this.checkMedia(media);

    this.router.navigate([route, media.id]);
  }

  private checkMedia(media: Media): string {
    if (media instanceof Episode) {
      this.mediaService.addToWatchHistory(media, media.getMediaType());
      return `/series/${media.seriesID}/player`;
    }

    if (media instanceof Series) return '/series';

    if (media instanceof Movie) {
      this.mediaService.addToWatchHistory(media, media.getMediaType());
      return '/movie/player';
    }

    return '';
  }

  public openSeriesPlayer(seriesID: string, id: string) {
    if (seriesID == null) return;
    this.router.navigate([`/series/${seriesID}/player`, id]);
  }

  public openMoviePlayer(id: string) {
    this.router.navigate(['/movie/player', id]);
  }
}
