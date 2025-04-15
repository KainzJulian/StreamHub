import { Component } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Media } from '../../../types/media';
import { Banner } from '../../molecules/banner/banner';
import { Genre } from '../../../types/genre';
import { MediaCardList } from '../../molecules/media-card-list/media-card-list';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [HomeTemplate, Banner, MediaCardList],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  getMedia(): Media {
    return new Media({
      id: '1',
      title: 'Inception',
      description:
        'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
      duration: 148,
      genreList: Object.values(Genre),
      pathMedia: '/assets/media/inception.jpg',
      rating: 90,
      isSeries: false,
      season: null,
      episode: null,
      isComplete: false,
    });
  }

  getMediaList(): Media[] {
    const list = [];

    const length = 40;

    for (let index = 0; index < length; index++) {
      list.push(
        new Media({
          id: '1',
          title: 'Inception',
          description:
            'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
          duration: 148,
          genreList: [Genre.SCIFI, Genre.ACTION],
          pathMedia: '/assets/media/inception.jpg',
          rating: 90,
          isSeries: false,
          season: null,
          episode: null,
        })
      );
    }

    return list;
  }
}
