import { Component, OnInit } from '@angular/core';
import { MediaTemplate } from '../../templates/media-template/media-template';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Media } from '../../../types/media';
import { ActivatedRoute } from '@angular/router';
import { getMedia } from '../../../../utils/utils';
import { GenreList } from '../../molecules/genre-list/genre-list';
import { MediaGenre } from '../../../types/genre';

@Component({
  selector: 'movie-page',
  standalone: true,
  imports: [MediaTemplate, HomeTemplate, GenreList],
  templateUrl: './movie-page.html',
  styleUrl: './movie-page.scss',
})
export class MoviePage implements OnInit {
  public media?: Media;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('this is the allmighty ID: ', id);

    this.media = getMedia(false);

    this.media.genreList = Object.values(MediaGenre);

    console.log('media', this.media);
  }
}
