import { Component, OnInit, signal } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Banner } from '../../molecules/banner/banner';
import { MediaCardList } from '../../molecules/media-card-list/media-card-list';
import { Media } from '../../../types/media';
import {
  getMovie,
  getMovieList,
  getSeries,
  getSeriesList,
} from '../../../../utils/utils';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Series } from '../../../types/series';

@Component({
  selector: 'media-page',
  standalone: true,
  imports: [HomeTemplate, Banner, MediaCardList, CommonModule],
  templateUrl: './media-page.html',
  styleUrl: './media-page.scss',
})
export class MediaPage implements OnInit {
  public mediaList = signal<Media[]>([]);
  public media = signal<Media>(new Series({}));

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const type = data['type'];

      if (type === 'series') {
        this.mediaList.set(getSeriesList(40));
        this.media.set(getSeries());
      } else if (type === 'movies') {
        this.media.set(getMovie());
        this.mediaList.set(getMovieList(40));
      }
    });
  }
}
