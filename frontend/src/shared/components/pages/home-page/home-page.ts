import { Component, OnInit, signal } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Banner } from '../../molecules/banner/banner';
import { MediaCardList } from '../../molecules/media-card-list/media-card-list';
import { Media } from '../../../types/media';
import { getMediaList } from '../../../../utils/utils';
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
    this.setHighestRated();
    // this.setWatchHistory();
  }

  getMediaList(): Media[] {
    return getMediaList(40);
  }

  setHighestRated() {
    const mediaList: Media[] = [];
    this.mediaService.getHighestRated(10).subscribe((response) => {
      console.log(response.data);
      response.data.forEach((item) => {
        if (item.type == 'Movie') mediaList.push(new Movie(item));
        if (item.type == 'Series') mediaList.push(new Series(item));
      });

      this.highestRatedList.set(mediaList);

      // this.list .set(response.data);
      // foreach medaia in the response if (media.type == 'movie') this.list.push(new Movie(media)) ...
      // response.data.forEach((media) => {
      //   this.mediaService.getMedia(media.id).subscribe((response) => {
      //     mediaList.push(response.data);
      //   });
      //   // die media list nimmt eine liste von ids auf und sucht erst drin nach den daten
      //   // oder
      //   // ich gebe eine liste von media zurück und sorg dafür dass das so funktioniert
      // });
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
