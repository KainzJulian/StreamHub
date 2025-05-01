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

  // banner should be a random series or movie

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService
  ) {
    this.route.data.subscribe((data) => {
      const type = data['type'];

      this.mediaService.getMediaList(type).subscribe((response) => {
        if (!response.success) throw new Error(response.error);

        const mediaList: Media[] = [];

        response.data.forEach((media) => {
          if (type === 'series') mediaList.push(new Series(media));
          if (type === 'movies') mediaList.push(new Movie(media));
        });

        this.mediaList.set(mediaList);

        if (this.mediaList().length == 0) {
          console.error('No Media Was found');
          return;
        }

        this.media.set(this.mediaList()[0]);
      });
    });
  }
}
