import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MediaTemplate } from '../../templates/media-template/media-template';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Media } from '../../../types/media';
import { GenreList } from '../../molecules/genre-list/genre-list';
import { MediaService } from '../../../services/media.service';
import { ActivatedRoute } from '@angular/router';
import { CurrentMediaRoutes } from '../../../../utils/apiRoutes';
import { Movie } from '../../../types/movie';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MediaCard } from '../../atoms/media-card/media-card';
import { MediaCardList } from '../../molecules/media-card-list/media-card-list';

@Component({
  selector: 'movie-page',
  standalone: true,
  imports: [
    CommonModule,
    MediaTemplate,
    HomeTemplate,
    GenreList,
    MediaCard,
    MediaCardList,
  ],
  templateUrl: './movie-page.html',
  styleUrl: './movie-page.scss',
})
export class MoviePage implements OnInit, OnDestroy {
  currentMovie = signal<Media | null>(null);
  similarMovies = signal<Media[] | null>(null);

  private subscribtion!: Subscription;

  constructor(
    public mediaService: MediaService,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }

  ngOnInit(): void {
    this.subscribtion = this.route.paramMap.subscribe((data) => {
      if (data === null) return;
      const movieID = data.get('id');
      if (movieID === null) throw new Error('No Movie ID specified');

      this.mediaService.getMovie(movieID).subscribe((response) => {
        this.currentMovie.set(new Movie(response.data));
        this.setSimilarMovies();
      });
    });
  }

  getVideoSource(): string {
    const movieID = this.route.snapshot.paramMap.get('id');

    if (!movieID) return '';

    return CurrentMediaRoutes.GET_VIDEO(movieID);
  }

  setSimilarMovies() {
    const movie = this.currentMovie();
    if (!movie) throw new Error('No Movie specified');

    this.mediaService.getSimilarMovies(movie.id).subscribe((response) => {
      this.similarMovies.set(response.data);
    });
  }

  displaySimilarMovies(): boolean {
    const similarMovies = this.similarMovies();

    if (similarMovies?.length === 1)
      return similarMovies[0].id !== this.currentMovie()?.id;

    return similarMovies !== null && similarMovies.length > 0;
  }
}
