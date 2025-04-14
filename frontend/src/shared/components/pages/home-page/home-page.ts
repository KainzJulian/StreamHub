import { Component } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { MediaCard } from '../../atoms/media-card/media-card';
import { Media } from '../../../types/media';
import { Banner } from '../../molecules/banner/banner';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [HomeTemplate, MediaCard, Banner],
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
      genreList: [],
      pathMedia: '/assets/media/inception.jpg',
      rating: 90,
      isSeries: false,
      season: null,
      episode: null,
    });
  }
}
