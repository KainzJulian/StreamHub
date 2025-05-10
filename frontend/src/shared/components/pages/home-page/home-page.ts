import { Component, OnInit, signal } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Banner } from '../../molecules/banner/banner';
import { MediaCardList } from '../../molecules/media-card-list/media-card-list';
import { Media } from '../../../types/media';
import { getMediaList } from '../../../../utils/utils';
import { MediaService } from '../../../services/media.service';
import { CommonModule } from '@angular/common';
import { Episode, Series } from '../../../types/series';
import { Movie } from '../../../types/movie';

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

  // TODO alle Episodes Serien und Movies erben von sind auch Media
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
  }

  getMediaList(): Media[] {
    return getMediaList(40);
  }

  setHighestRated() {
    this.mediaService.getHighestRatedMovies(5).subscribe((response) => {
      console.log('Movies', response.data);
      const movieList: Movie[] = [];

      response.data.forEach((element) => movieList.push(new Movie(element)));

      this.highestRatedList.update((oldList) => {
        if (oldList) return [...oldList, ...movieList];
        else return movieList;
      });

      this.highestRatedList.update((oldList) => {
        if (oldList == null) return null;
        return oldList.sort((a, b) => {
          if (a.rating == null || b.rating == null) return 1;
          return b.rating - a.rating;
        });
      });
    });

    this.mediaService.getHighestRatedSeries(5).subscribe((response) => {
      console.log('Series', response.data);
      const seriesList: Series[] = [];

      response.data.forEach((element) => seriesList.push(new Series(element)));

      this.highestRatedList.update((oldList) => {
        if (oldList) return [...oldList, ...seriesList];
        else return seriesList;
      });

      this.highestRatedList.update((oldList) => {
        if (oldList == null) return null;
        return oldList.sort((a, b) => {
          if (a.rating == null || b.rating == null) return 1;
          return b.rating - a.rating;
        });
      });
    });
  }
}
