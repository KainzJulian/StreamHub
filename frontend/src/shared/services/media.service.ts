import { Injectable, signal } from '@angular/core';
import { Episode, Series } from '../types/series';
import { getSeries } from '../../utils/utils';
import { Media } from '../types/media';
import { HttpClient } from '@angular/common/http';
import { MovieRoutes, SeriesRoutes } from '../../utils/apiRoutes';
import { Observable } from 'rxjs';
import { BackendResponse } from '../types/response';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  public currentMedia = signal<Media | null>(null);

  public currentEpisode = signal<Episode | null>(null);
  public currentSeason = signal<number>(1);

  constructor(private http: HttpClient) {
    this.currentMedia.set(getSeries());
  }

  public getMediaList(
    type: 'series' | 'movies'
  ): Observable<BackendResponse<Media[]>> {
    const route =
      type === 'series' ? SeriesRoutes.SERIES_ALL : MovieRoutes.MOVIES;

    return this.http.get<BackendResponse<Media[]>>(route);
  }

  public getSeries(seriesID: string): Observable<BackendResponse<Series>> {
    return this.http.get<BackendResponse<Series>>(
      SeriesRoutes.SERIES(seriesID)
    );
  }
}
