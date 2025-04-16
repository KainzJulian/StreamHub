import { Component } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Banner } from '../../molecules/banner/banner';
import { MediaCardList } from '../../molecules/media-card-list/media-card-list';
import { Media } from '../../../types/media';
import { getMedia, getMediaList, getSeries } from '../../../../utils/utils';
import { EpisodeCard } from '../../atoms/episode-card/episode-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'series-overview-page',
  standalone: true,
  imports: [CommonModule, HomeTemplate, Banner, MediaCardList, EpisodeCard],
  templateUrl: './series-overview-page.html',
  styleUrl: './series-overview-page.scss',
})
export class SeriesOverviewPage {
  getSeries() {
    return getSeries();
  }

  getMedia(): Media {
    return getMedia(true);
  }

  getMediaList(): Media[] {
    return getMediaList(23, true);
  }
}
