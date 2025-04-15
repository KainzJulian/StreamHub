import { Component } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Banner } from '../../molecules/banner/banner';
import { MediaCardList } from '../../molecules/media-card-list/media-card-list';
import { Media } from '../../../types/media';
import { getMedia, getMediaList } from '../../../../utils/utils';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [HomeTemplate, Banner, MediaCardList],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  getMediaList(): Media[] {
    return getMediaList(40);
  }

  getMedia(): Media {
    return getMedia();
  }
}
