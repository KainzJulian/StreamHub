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
import { MediaGenre } from '../types/genre';
import { HttpRequestHandler } from '../types/APIMethodService';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  public currentMedia = signal<Media | null>(null);

  public currentEpisode = signal<Episode | null>(null);
  public currentSeason = signal<number>(1);

  private apiService!: HttpRequestHandler;

  constructor(private http: HttpClient) {
    this.apiService = new HttpRequestHandler(http);
  }

  public getMediaList(
    type: 'series' | 'movies'
  ): Observable<BackendResponse<Media[]>> {
    const route =
      type === 'series' ? SeriesRoutes.SERIES_ALL : MovieRoutes.MOVIES;

    return this.apiService.get(route);
  }

  public getSeries(seriesID: string): Observable<BackendResponse<Series>> {
    return this.apiService.get(SeriesRoutes.SERIES(seriesID));
  }

  public getEpisode(episodeID: string): Observable<BackendResponse<Episode>> {
    return this.apiService.get(EpisodeRoutes.Episode(episodeID));
  }

  public getMovie(movieID: string): Observable<BackendResponse<Movie>> {
    return this.apiService.get(MovieRoutes.MOVIE(movieID));
  }

  public setCurrentMedia(id: string = '') {
    const path = CurrentMediaRoutes.SET_CURRENT_MEDIA;
    const media = new CurrentMedia({ mediaID: id });

    this.apiService.post(path, media);
  }

  public getCurrentMedia(): Observable<
    BackendResponse<{ type: string; media: Media }>
  > {
    return this.apiService.get(CurrentMediaRoutes.CURRENT_MEDIA);
  }

  public getHighestRatedMovies(
    limit: number
  ): Observable<BackendResponse<Movie[]>> {
    return this.apiService.get(MovieRoutes.HIGHEST_RATED(limit));
  }

  public getHighestRatedSeries(
    limit: number
  ): Observable<BackendResponse<Series[]>> {
    return this.apiService.get(SeriesRoutes.HIGHEST_RATED(limit));
  }

  public getWatchHistory(limit: number): Observable<BackendResponse<Media[]>> {
    return this.apiService.get(WatchHistoryRoutes.GET_HISTORY(limit));
  }

  public addToWatchHistory(media: Media) {
    this.apiService.post(
      WatchHistoryRoutes.ADD_HISTORY_ITEM(media.id, media.type)
    );
  }

  public getHighestRated(limit: number): Observable<BackendResponse<Media[]>> {
    return this.apiService.get(MediaRoutes.HIGHEST_RATED(limit));
  }

  public getMedia(
    id: string
  ): Observable<BackendResponse<Episode | Movie | Series>> {
    return this.apiService.get(MediaRoutes.MEDIA(id));
  }

  public getRandomMediaList(
    limit: number
  ): Observable<BackendResponse<Media[]>> {
    return this.apiService.get(MediaRoutes.RANDOM_MEDIA_LIST(limit));
  }

  public getRandomMovie(limit: number): Observable<BackendResponse<Media[]>> {
    return this.apiService.get(MovieRoutes.RANDOM(limit));
  }

  public getRandomSeries(limit: number): Observable<BackendResponse<Media[]>> {
    return this.apiService.get(SeriesRoutes.RANDOM(limit));
  }

  public getSearch(
    input: string,
    genres: MediaGenre[]
  ): Observable<BackendResponse<Media[]>> {
    return this.apiService.post(MediaRoutes.SEARCH(input), genres);
  }

  public getWatchTime(
    id: string | undefined
  ): Observable<BackendResponse<number>> {
    if (!id) throw new Error('Provided ID is undefined');
    return this.apiService.get<number>(MediaRoutes.GET_TIME_WATCHED(id));
  }

  public updateData(media: Media): Observable<BackendResponse<boolean>> {
    return this.apiService.put(MediaRoutes.PUT_DATA(media.id), media);
  }
}
