import { Component, signal } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Banner } from '../../molecules/banner/banner';
import { MediaCardList } from '../../molecules/media-card-list/media-card-list';
import { Media } from '../../../types/media';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Series } from '../../../types/series';
import { MediaService } from '../../../services/media.service';
import { Movie } from '../../../types/movie';
import { MediaRouterService } from '../../../services/media-router.service';

@Component({
  selector: 'media-page',
  standalone: true,
  imports: [HomeTemplate, Banner, MediaCardList, CommonModule],
  templateUrl: './media-page.html',
  styleUrl: './media-page.scss',
})
export class MediaPage {
  public mediaList = signal<Media[]>([]);
  public media = signal<Media | null>(null);

  private type!: 'series' | 'movies';

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private mediaRouteService: MediaRouterService
  ) {
    this.route.data.subscribe((data) => {
      this.type = data['type'];

      if (!this.type) throw new Error('Type is not defined');

      if (this.type === 'series') {
        this.mediaService
          .getRandomSeries(1)
          .subscribe((response) => this.media.set(response.data[0]));

        this.mediaService.getRandomSeries(15).subscribe((response) => {
          if (!response.success) throw new Error(response.error);

          this.updateMediaList(response.data, this.type);
        });
      } else if (this.type === 'movies') {
        this.mediaService
          .getRandomMovie(1)
          .subscribe((response) => this.media.set(response.data[0]));

        this.mediaService.getRandomMovie(15).subscribe((response) => {
          if (!response.success) throw new Error(response.error);

          this.updateMediaList(response.data, this.type);
        });
      }
    });
  }

  updateMediaList(mediaList: Media[], type: 'series' | 'movies' = 'series') {
    const help = mediaList.map((media) => {
      if (type === 'series') return new Series(media);
      if (type === 'movies') return new Movie(media);
      throw new Error('Type does not exist: ' + type);
    });

    this.mediaList.set(help);
  }

  showAllMedia() {
    this.mediaRouteService.openLibraryPage(this.type);
  }
}
