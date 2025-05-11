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
  public watchHistory = signal<Media[] | null>(null);

  constructor(private mediaService: MediaService) {}

  ngOnInit(): void {
    this.mediaService.getCurrentMedia().subscribe((response) => {
      const mediaType = response.data.type;
      const media = response.data.media;

      if (mediaType == 'episode') this.currentMedia.set(new Episode(media));
      if (mediaType == 'movie') this.currentMedia.set(new Movie(media));

      console.log('CurrentMedia', this.currentMedia());
    });

    // TODO rework these functions because they depend on the request speed of each request instead of sorting
    // this.setHighestRated();
    // this.setWatchHistory();
  }

  getMediaList(): Media[] {
    return getMediaList(40);
  }

  setHighestRated() {
    this.mediaService.getHighestRatedMovies(10).subscribe((response) => {
      console.log('Movies', response.data);
      const movieList: Movie[] = [];

      response.data.forEach((element) => movieList.push(new Movie(element)));

      this.highestRatedList.update((oldList) => {
        if (oldList) return [...oldList, ...movieList];
        else return movieList;
      });

      this.sortHighestRatedList();
    });

    this.mediaService.getHighestRatedSeries(10).subscribe((response) => {
      console.log('Series', response.data);
      const seriesList: Series[] = [];

      response.data.forEach((element) => seriesList.push(new Series(element)));

      this.highestRatedList.update((oldList) => {
        if (oldList) return [...oldList, ...seriesList];
        else return seriesList;
      });

      this.sortHighestRatedList();
    });
  }

  private sortHighestRatedList() {
    this.highestRatedList.update((oldList) => {
      if (oldList == null) return null;
      return oldList.sort((a, b) => {
        if (a.rating == null || b.rating == null) return 1;
        return b.rating - a.rating;
      });
    });
  }

  private setWatchHistory() {
    this.mediaService.getWatchHistory(10).subscribe((response) => {
      const history = response.data.history;

      const list: { media: Media; time: Date | null }[] = [];

      history?.forEach((element) => {
        if (!element.id) throw new Error('Element must have a valid ID');

        switch (element.type) {
          case 'Movie':
            this.mediaService
              .getMovie(element.id)
              .subscribe((response) =>
                list.push({ media: response.data, time: element.time })
              );
            break;
          case 'Episode':
            this.mediaService
              .getEpisode(element.id)
              .subscribe((response) =>
                list.push({ media: response.data, time: element.time })
              );
            break;

          default:
            throw new Error('Wrong type in watch History: ' + element.id);
        }

        list.sort((a, b) => a.time?.getTime() ?? 0 - (b.time?.getTime() ?? 0));
      });
    });
  }
}
