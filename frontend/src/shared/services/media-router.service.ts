import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Media } from '../types/media';
import { Series } from '../types/series';
import { Movie } from '../types/movie';

@Injectable({
  providedIn: 'root',
})
export class MediaRouterService {
  private route: '/player' | '/series' = '/player';
  private mediaID: string = '';

  constructor(private router: Router) {}

  openMediaPlayer(media: Media) {
    this.checkMedia(media);
    this.mediaID = media.id;

    this.router.navigate([this.route, this.mediaID]);
  }

  checkMedia(media: Media) {
    if (media instanceof Series) this.route = '/series';
    if (media instanceof Movie) this.route = '/player';
  }

  openPlayer(id: string) {
    this.router.navigate(['/player', id]);
  }
}
