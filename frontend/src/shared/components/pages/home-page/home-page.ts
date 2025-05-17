import { Component, OnInit, signal } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Banner } from '../../molecules/banner/banner';
import { MediaCardList } from '../../molecules/media-card-list/media-card-list';
import { Media } from '../../../types/media';
import { MediaService } from '../../../services/media.service';
import { CommonModule } from '@angular/common';
import { Episode } from '../../../types/seriesEpisode';
import { Movie } from '../../../types/movie';
import { Series } from '../../../types/series';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [HomeTemplate, Banner, MediaCardList, CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  public currentMedia = signal<Media | null>(null);

  public highestRatedList = signal<Media[] | null>(null);
  public watchHistory = signal<Media[] | null>(null);
  public mediaList = signal<Media[] | null>(null);

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {
    this.mediaService.getCurrentMedia().subscribe((response) => {
      const mediaType = response.data.type;
      const media = response.data.media;

      if (mediaType == 'episode') this.currentMedia.set(new Episode(media));
      if (mediaType == 'movie') this.currentMedia.set(new Movie(media));

      console.log('CurrentMedia', this.currentMedia());
    });

    this.setHighestRated();
    this.setWatchHistory();
    this.setMediaList();
  }

  private setHighestRated() {
    const mediaList: Media[] = [];

    this.mediaService.getHighestRated(10).subscribe((response) => {
      response.data.forEach((item) => {
        if (item.type == 'Movie') mediaList.push(new Movie(item));
        if (item.type == 'Series') mediaList.push(new Series(item));
      });

      this.highestRatedList.set(mediaList);
    });
  }

  private setWatchHistory() {
    const mediaList: Media[] = [];

    this.mediaService.getWatchHistory(10).subscribe((response) => {
      response.data.forEach((item) => {
        if (item.type == 'Movie') mediaList.push(new Movie(item));
        if (item.type == 'Episode') mediaList.push(new Episode(item));
      });

      this.watchHistory.set(mediaList);
    });
  }

  private setMediaList() {
    const mediaList: Media[] = [];

    this.mediaService.getRandomMediaList(20).subscribe((response) => {
      response.data.forEach((item) => {
        if (item.type == 'Movie') mediaList.push(new Movie(item));
        if (item.type == 'Series') mediaList.push(new Series(item));
      });

      this.mediaList.set(mediaList);
    });
  }
}
