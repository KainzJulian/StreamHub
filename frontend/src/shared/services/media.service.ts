import { Injectable, signal } from '@angular/core';
import { Episode } from '../types/series';
import { getSeries } from '../../utils/utils';
import { Media } from '../types/media';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  public currentMedia = signal<Media | null>(null);

  public currentEpisode = signal<Episode | null>(null);
  public currentSeason = signal<number>(1);

  constructor() {
    this.currentMedia.set(getSeries());
  }
}
