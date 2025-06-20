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
      console.log(type);

      switch (type) {
        case 'highRated':
          this.mediaService.getHighestRated(0).subscribe((response) => {
            this.media.set(response.data);
            console.log(this.media());
          });
          break;
        case 'movies':
          break;
        case 'moviesSeries':
          break;
        case 'recWatched':
          break;
        case 'series':
          break;

        default:
          throw new Error('Type does not Exist: ' + type);
      }
    });
  }
}
