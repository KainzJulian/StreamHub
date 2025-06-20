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

      if (this.type === 'series')
        this.mediaService
          .getRandomSeries(1)
          .subscribe((response) => this.media.set(response.data[0]));
      else if (this.type === 'movies')
        this.mediaService
          .getRandomMovie(1)
          .subscribe((response) => this.media.set(response.data[0]));

      this.mediaService.getMediaList(this.type).subscribe((response) => {
        if (!response.success) throw new Error(response.error);

        const mediaList: Media[] = [];

        response.data.forEach((media) => {
          if (this.type === 'series') mediaList.push(new Series(media));
          if (this.type === 'movies') mediaList.push(new Movie(media));
        });

        this.mediaList.set(mediaList);

        if (this.mediaList().length == 0) {
          console.error('No Media Was found');
          return;
        }
      });
    });
  }

  showAllMedia() {
    this.mediaRouteService.openLibraryPage(this.type);
  }
}
