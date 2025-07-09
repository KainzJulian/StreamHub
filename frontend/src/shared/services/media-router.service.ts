import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Media } from '../types/media';
import { Episode } from '../types/seriesEpisode';
import { MediaService } from './media.service';
import { LibraryListType } from '../types/libraryListType';

@Injectable({
  providedIn: 'root',
})
export class MediaRouterService {
  constructor(
    private router: Router,
    private mediaService: MediaService,
  ) {}

  public openMediaPlayer(media: Media) {
    let route: string = '';

    if (media instanceof Episode) route = `/series/${media.seriesID}/player`;

    if (media.type === 'Series') route = '/series';

    if (media.type === 'Movie') route = `/movie/player`;

    this.router.navigate([route, media.id]);
  }

  public openSeriesPlayer(seriesID: string, id: string) {
    if (seriesID == null) return;
    this.router.navigate([`/series/${seriesID}/player`, id]);
  }

  public openMoviePlayer(id: string) {
    this.router.navigate(['/movie/player', id]);
  }

  openSearch(input: string) {
    this.router.navigate(['/search', input]);
  }

  openEditPage(id: string) {
    this.router.navigate(['/edit', id]);
  }

  openLibraryPage(type: LibraryListType) {
    this.router.navigate(['/library', type]);
  }
}
