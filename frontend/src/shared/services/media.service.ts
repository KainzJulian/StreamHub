import { Injectable, signal } from '@angular/core';
import { Episode, Series } from '../types/series';
import { Media } from '../types/media';
import { HttpClient } from '@angular/common/http';
import {
  CurrentMediaRoutes,
  MovieRoutes,
  SeriesRoutes,
} from '../../utils/apiRoutes';
import { Observable } from 'rxjs';
import { BackendResponse } from '../types/response';
import { CurrentMedia } from '../types/currentMedia';
import { Movie } from '../types/movie';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  public currentMedia = signal<Media | null>(null);

  public currentEpisode = signal<Episode | null>(null);
  public currentSeason = signal<number>(1);

  constructor(private http: HttpClient) {}

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

  public getMovie(movieID: string): Observable<BackendResponse<Movie>> {
    return this.http.get<BackendResponse<Movie>>(MovieRoutes.MOVIE(movieID));
  }

  public setCurrentMedia(id: string = '') {
    const path = CurrentMediaRoutes.SET_CURRENT_MEDIA;
    const media = new CurrentMedia({ mediaID: id });

    this.http.post<BackendResponse<boolean>>(path, media).subscribe((req) => {
      console.log('Data:', req.data);
    });
  }

  public getCurrentMedia(): Observable<
    BackendResponse<{ type: string; media: Media }>
  > {
    return this.http.get<BackendResponse<{ type: string; media: Media }>>(
      CurrentMediaRoutes.CURRENT_MEDIA
    );
  }
}
