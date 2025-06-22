import { Component, signal } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { MediaService } from '../../../services/media.service';
import { ActivatedRoute } from '@angular/router';
import { Media } from '../../../types/media';
import { MediaCardList } from '../../molecules/media-card-list/media-card-list';

@Component({
  selector: 'media-library',
  standalone: true,
  imports: [HomeTemplate, MediaCardList],
  templateUrl: './media-library.html',
  styleUrl: './media-library.scss',
})
export class MediaLibrary {
  public media = signal<Media[] | null>(null);

  constructor(
    private mediaService: MediaService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((param) => {
      const type = param.get('type');

      switch (type) {
        case 'highRated':
          this.mediaService
            .getHighestRated(0)
            .subscribe((response) => this.media.set(response.data));
          break;

        case 'movies':
          this.mediaService
            .getRandomMovie(0)
            .subscribe((response) => this.media.set(response.data));
          break;

        case 'moviesSeries':
          this.mediaService
            .getRandomMediaList(0)
            .subscribe((response) => this.media.set(response.data));
          break;

        case 'recWatched':
          this.mediaService
            .getWatchHistory(0)
            .subscribe((response) => this.media.set(response.data));
          break;

        case 'series':
          this.mediaService
            .getRandomSeries(0)
            .subscribe((response) => this.media.set(response.data));
          break;

        default:
          throw new Error('Type does not Exist: ' + type);
      }
    });
  }
}
