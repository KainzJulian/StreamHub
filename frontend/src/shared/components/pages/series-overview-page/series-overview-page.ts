import { Component } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Banner } from '../../molecules/banner/banner';
import { Media } from '../../../types/media';
import { CommonModule } from '@angular/common';
import { EpisodeList } from '../../molecules/episode-list/episode-list';
import { MediaService } from '../../../services/media.service';
import { Series } from '../../../types/series';

@Component({
  selector: 'series-overview-page',
  standalone: true,
  imports: [CommonModule, HomeTemplate, Banner, EpisodeList],
  templateUrl: './series-overview-page.html',
  styleUrl: './series-overview-page.scss',
})
export class SeriesOverviewPage {
  public media: Media | null = null;
  public series: Series | null = null;

  constructor(mediaService: MediaService) {
    this.media = mediaService.currentMedia();

    if (this.media instanceof Series) this.series = this.media;
  }
}
