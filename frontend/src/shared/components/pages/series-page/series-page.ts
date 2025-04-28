import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { MediaTemplate } from '../../templates/media-template/media-template';
import { EpisodeList } from '../../molecules/episode-list/episode-list';
import { Episode, Series } from '../../../types/series';
import { BaseButton } from '../../atoms/base-button/base-button';
import { OnClickOutsideDirective } from '../../../directives/on-click-outside.directive';
import { MediaService } from '../../../services/media.service';
import { Media } from '../../../types/media';
import { MediaRouterService } from '../../../services/media-router.service';
import { ActivatedRoute } from '@angular/router';

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
export class SeriesPage implements OnInit {
  @ViewChild('dropdownContent') dropdownContent!: ElementRef;

  media: Media | null = null;

  currentEpisode = signal<Episode | null>(null);
  currentSeason = signal<number>(0);
  currentSeries = signal<Series | null>(null);

  constructor(
    public mediaService: MediaService,
    private mediaRouterService: MediaRouterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const seriesID = this.route.snapshot.paramMap.get('seriesID');
    const episodeID = this.route.snapshot.paramMap.get('episodeID');

    if (seriesID == null || episodeID == null)
      throw new Error('No ID specified');

    this.mediaService.getSeries(seriesID).subscribe((response) => {
      this.currentSeries.set(new Series(response.data));

      const episode = this.currentSeries()?.episodeList.find(
        (episode) => episode.id == episodeID
      );

      if (episode) {
        this.currentEpisode.set(episode);
        this.currentSeason.set(episode.season);
      }
    });
  }

  getStatus(): string {
    if (this.currentSeries()?.isComplete) return 'Complete';
    else return 'on-going';
  }

  showDropdownContent() {
    if (this.dropdownContent === undefined) return;
    this.dropdownContent.nativeElement.style.visibility = 'visible';
  }

  hideDropdownContent() {
    if (this.dropdownContent === undefined) return;
    this.dropdownContent.nativeElement.style.visibility = 'hidden';
  }

  switchDropdownContent() {
    if (this.dropdownContent === undefined) return;

    if (this.dropdownContent.nativeElement.style.visibility == 'hidden')
      this.showDropdownContent();
    else this.hideDropdownContent();
  }

  getEpisodeList(): Episode[] | null {
    const series = this.currentSeries();

    if (series == null) return null;

    return series.getEpisodeArray()[this.currentSeason() - 1];
  }

  setSeason(season: number) {
    if (this.currentSeason() == season) return;

    this.currentSeason.set(season);

    const episode = this.currentSeries()?.getFirstEpisodeOfSeason(season);
    if (episode) {
      this.currentEpisode.set(episode);
      this.mediaRouterService.openPlayer(
        episode?.id,
        true,
        this.currentSeries()?.id
      );
    }

    this.hideDropdownContent();
  }

  navigateToAdjacentEpisode(increment: 1 | -1) {
    const episodeList = this.currentSeries()?.episodeList;
    const index = this.getIndexOfEpisode(this.currentEpisode());

    if (episodeList === undefined) throw new Error('Episode List is undefined');

    if (increment == -1 && index + increment < 0)
      throw new Error('No Episode before the current one');

    if (increment == 1 && index + increment >= episodeList.length)
      throw new Error('No Episode after the current one');

    const episode = episodeList[index + increment];

    this.currentEpisode.set(episode);
    this.currentSeason.set(episode.season);

    this.mediaRouterService.openPlayer(
      episode.id,
      true,
      this.currentSeries()?.id
    );
  }

  private getIndexOfEpisode(episode: Episode | null): number {
    const index = this.currentSeries()?.episodeList.findIndex((val) => {
      return val.id == episode?.id;
    });

    if (index === undefined) {
      console.error('The Episode was not found ', this.currentEpisode());
      throw new Error('The Episode was not found');
    }

    return index;
  }

  public setCurrentEpisode(episode: Episode) {
    console.log('Episode:', episode);

    this.currentEpisode.set(episode);
    this.currentSeason.set(episode.season);
  }
}
