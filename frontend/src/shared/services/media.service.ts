import { Injectable, signal } from '@angular/core';
import { Series } from '../types/series';
import { Episode } from '../types/seriesEpisode';
import { Media } from '../types/media';
import { HttpClient } from '@angular/common/http';
import {
  CurrentMediaRoutes,
  EpisodeRoutes,
  MediaRoutes,
  MovieRoutes,
  SeriesRoutes,
  WatchHistoryRoutes,
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

  public getEpisode(episodeID: string): Observable<BackendResponse<Episode>> {
    return this.http.get<BackendResponse<Episode>>(
      EpisodeRoutes.Episode(episodeID)
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

  public getHighestRatedMovies(
    limit: number
  ): Observable<BackendResponse<Movie[]>> {
    return this.http.get<BackendResponse<Movie[]>>(
      MovieRoutes.HIGHEST_RATED(limit)
    );
  }

  public getHighestRatedSeries(
    limit: number
  ): Observable<BackendResponse<Series[]>> {
    return this.http.get<BackendResponse<Series[]>>(
      SeriesRoutes.HIGHEST_RATED(limit)
    );
  }

  public getWatchHistory(limit: number): Observable<BackendResponse<Media[]>> {
    return this.http.get<BackendResponse<Media[]>>(
      WatchHistoryRoutes.GET_HISTORY(limit)
    );
  }

  public addToWatchHistory(media: Media) {
    console.log('Add to watch history: ', media);

    this.http
      .post<BackendResponse<boolean>>(
        WatchHistoryRoutes.ADD_HISTORY_ITEM(media.id, media.type),
        null
      )
      .subscribe((response) => {
        console.warn('response of addToWatchHistory', response);
      });
  }

  public getHighestRated(limit: number): Observable<BackendResponse<Media[]>> {
    return this.http.get<BackendResponse<Media[]>>(
      MediaRoutes.HIGHEST_RATED(limit)
    );
  }

  public getMedia(
    id: string
  ): Observable<BackendResponse<Episode | Movie | Series>> {
    return this.http.get<BackendResponse<Episode | Movie | Series>>(
      MediaRoutes.MEDIA(id)
    );
  }

  public getRandomMediaList(
    limit: number
  ): Observable<BackendResponse<Media[]>> {
    return this.http.get<BackendResponse<Media[]>>(
      MediaRoutes.RANDOM_MEDIA_LIST(limit)
    );
  }

  public getSearch(input: string): Observable<BackendResponse<Media[]>> {
    return this.http.get<BackendResponse<Media[]>>(MediaRoutes.SEARCH(input));
  }
}
