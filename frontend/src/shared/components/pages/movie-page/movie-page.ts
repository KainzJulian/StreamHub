import { Component, OnInit, signal } from '@angular/core';
import { MediaTemplate } from '../../templates/media-template/media-template';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Media } from '../../../types/media';
import { GenreList } from '../../molecules/genre-list/genre-list';
import { MediaService } from '../../../services/media.service';
import { ActivatedRoute } from '@angular/router';
import { CurrentMediaRoutes } from '../../../../utils/apiRoutes';
import { Movie } from '../../../types/movie';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'movie-page',
  standalone: true,
  imports: [CommonModule, MediaTemplate, HomeTemplate, GenreList],
  templateUrl: './movie-page.html',
  styleUrl: './movie-page.scss',
})
export class MoviePage implements OnInit {
  currentMovie = signal<Media | null>(null);

  constructor(
    public mediaService: MediaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const movieID = this.route.snapshot.paramMap.get('id');

    if (movieID == null) throw new Error('No ID specified');

    this.mediaService.setCurrentMedia(movieID);

    this.mediaService.getMovie(movieID).subscribe((response) => {
      this.currentMovie.set(new Movie(response.data));
    });
  }

  getVideoSource(): string {
    const movieID = this.route.snapshot.paramMap.get('id');

    if (!movieID) return '';

    return CurrentMediaRoutes.GET_VIDEO(movieID);
  }
}
