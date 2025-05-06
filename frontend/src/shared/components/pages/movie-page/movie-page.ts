import { Component } from '@angular/core';
import { MediaTemplate } from '../../templates/media-template/media-template';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Media } from '../../../types/media';
import { GenreList } from '../../molecules/genre-list/genre-list';
import { MediaService } from '../../../services/media.service';
import { ActivatedRoute } from '@angular/router';
import { MovieRoutes } from '../../../../utils/apiRoutes';

@Component({
  selector: 'movie-page',
  standalone: true,
  imports: [MediaTemplate, HomeTemplate, GenreList],
  templateUrl: './movie-page.html',
  styleUrl: './movie-page.scss',
})
export class MoviePage {
  public media: Media | null;

  constructor(
    public mediaService: MediaService,
    private route: ActivatedRoute
  ) {
    this.media = mediaService.currentMedia();
  }

  getVideoSource(): string {
    const movieID = this.route.snapshot.paramMap.get('id');
    console.log('Source', movieID);

    if (!movieID) return '';

    return MovieRoutes.VIDEO(movieID);
  }
}
