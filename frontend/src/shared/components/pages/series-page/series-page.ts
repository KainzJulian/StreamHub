import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { MediaTemplate } from '../../templates/media-template/media-template';
import { EpisodeList } from '../../molecules/episode-list/episode-list';
import { Episode, Series } from '../../../types/series';
import { BaseButton } from '../../atoms/base-button/base-button';
import { OnClickOutsideDirective } from '../../../directives/on-click-outside.directive';
import { MediaService } from '../../../services/media.service';
import { Media } from '../../../types/media';
import { MediaRouterService } from '../../../services/media-router.service';

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
  currentSeason = signal<number>(0);
  currentSeries: Series | null = null;

  constructor(
    public seriesService: MediaService,
    private mediaRouterService: MediaRouterService
  ) {
    this.media = this.seriesService.currentMedia();

    this.currentEpisode = this.seriesService.currentEpisode;
    this.currentSeason = this.seriesService.currentSeason;

    if (this.media instanceof Series) this.currentSeries = this.media;
  }

  getStatus(): string {
    if (this.currentSeries?.isComplete) return 'Complete';
    else return 'on-going';
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
    if (episode) {
      this.currentEpisode.set(episode);
      this.mediaRouterService.openPlayer(episode?.id, true);
    }

    this.hideDropdownContent();
  }

  navigateToAdjacentEpisode(increment: 1 | -1) {
    const episodeList = this.currentSeries?.episodeList;
    const index = this.getIndexOfEpisode(this.currentEpisode());

    if (episodeList === undefined) throw new Error('Episode List is undefined');

    if (increment == -1 && index + increment < 0)
      throw new Error('No Episode before the current one');

    if (increment == 1 && index + increment >= episodeList.length)
      throw new Error('No Episode after the current one');

    const episode = episodeList[index + increment];

    this.currentEpisode.set(episode);
    this.currentSeason.set(episode.season);

    this.mediaRouterService.openPlayer(episode.id, true);
  }

  private getIndexOfEpisode(episode: Episode | null): number {
    const index = this.currentSeries?.episodeList.findIndex((val) => {
      return val.id == episode?.id;
    });

    if (index === undefined) {
      console.error('The Episode was not found ', this.currentEpisode());
      throw new Error('The Episode was not found');
    }

    return index;
  }
}
