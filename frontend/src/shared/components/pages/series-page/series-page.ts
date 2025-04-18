import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { MediaTemplate } from '../../templates/media-template/media-template';
import { EpisodeList } from '../../molecules/episode-list/episode-list';
import { Episode, Series } from '../../../types/series';
import { BaseButton } from '../../atoms/base-button/base-button';
import { OnClickOutsideDirective } from '../../../directives/on-click-outside.directive';
import { MediaService } from '../../../services/media.service';
import { Media } from '../../../types/media';

@Component({
  selector: 'series-page',
  standalone: true,
  imports: [
    OnClickOutsideDirective,
    HomeTemplate,
    MediaTemplate,
    EpisodeList,
    BaseButton,
  ],
  templateUrl: './series-page.html',
  styleUrl: './series-page.scss',
})
export class SeriesPage {
  @ViewChild('dropdownContent') dropdownContent!: ElementRef;

  media: Media | null = null;

  currentEpisode = signal<Episode | null>(null);
  // currentSeries = signal<Series | null>(null);
  currentSeason = signal<number>(0);

  // currentEpisode: Episode | null = null;
  currentSeries: Series | null = null;
  // currentSeason: number = 0;

  constructor(public seriesService: MediaService) {
    this.media = this.seriesService.currentMedia();

    this.currentEpisode = this.seriesService.currentEpisode;
    this.currentSeason = this.seriesService.currentSeason;

    if (this.media instanceof Series) this.currentSeries = this.media;
  }

  showDropdownContent() {
    this.dropdownContent.nativeElement.style.visibility = 'visible';
  }

  hideDropdownContent() {
    this.dropdownContent.nativeElement.style.visibility = 'hidden';
  }

  switchDropdownContent() {
    if (this.dropdownContent.nativeElement.style.visibility == 'hidden')
      this.showDropdownContent();
    else this.hideDropdownContent();
  }

  getEpisodeList(): Episode[] | null {
    const series = this.currentSeries;

    if (series == null) return null;

    return series.getEpisodeArray()[this.currentSeason() - 1];
  }

  setSeason(season: number) {
    if (this.currentSeason() == season) return;

    this.currentSeason.set(season);

    const episode = this.currentSeries?.getFirstEpisodeOfSeason(season);
    if (episode) this.currentEpisode.set(episode);

    this.hideDropdownContent();
  }
}
