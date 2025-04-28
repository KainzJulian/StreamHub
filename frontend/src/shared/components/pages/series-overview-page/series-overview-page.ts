import { Component, OnInit, signal } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Banner } from '../../molecules/banner/banner';
import { CommonModule } from '@angular/common';
import { EpisodeList } from '../../molecules/episode-list/episode-list';
import { MediaService } from '../../../services/media.service';
import { Series } from '../../../types/series';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'series-overview-page',
  standalone: true,
  imports: [CommonModule, HomeTemplate, Banner, EpisodeList],
  templateUrl: './series-overview-page.html',
  styleUrl: './series-overview-page.scss',
})
export class SeriesOverviewPage implements OnInit {
  public series = signal<Series | null>(null);

  constructor(
    private mediaService: MediaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const seriesID = this.route.snapshot.paramMap.get('seriesID');

    if (!seriesID) return;

    this.mediaService.getSeries(seriesID).subscribe((response) => {
      this.series.set(new Series(response.data));
    });
  }
}
