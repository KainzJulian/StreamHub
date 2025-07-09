import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { Media } from '../../../types/media';
import { MediaService } from '../../../services/media.service';
import { Movie } from '../../../types/movie';
import { Series } from '../../../types/series';
import { MediaCardList } from '../../molecules/media-card-list/media-card-list';
import { CommonModule } from '@angular/common';
import { BaseButton } from '../../atoms/base-button/base-button';
import { Icon } from '../../atoms/icon/icon';
import { MediaRouterService } from '../../../services/media-router.service';
import { MediaGenre } from '../../../types/genre';
import { Genre } from '../../atoms/genre/genre';

@Component({
  selector: 'search-page',
  standalone: true,
  imports: [CommonModule, HomeTemplate, MediaCardList, BaseButton, Icon, Genre],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage implements OnInit {
  @ViewChild('input') inputElement!: ElementRef;

  public mediaList = signal<Media[] | null>(null);

  private genreList = new Set<MediaGenre>();

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private mediaRoute: MediaRouterService,
  ) {}

  ngOnInit(): void {
    const search = this.route.snapshot.paramMap.get('input');
    if (search !== null && search !== '') this.setMediaList(search);
  }

  public setMediaList(input: string) {
    if (this.checkInput(input)) return;

    this.mediaService
      .getSearch(input, Array.from(this.genreList.values()))
      .subscribe((response) => {
        const mediaList: Media[] = [];

        response.data.forEach((element) => {
          const type = element.type;
          if (type === 'Movie') mediaList.push(new Movie(element));
          if (type === 'Series') mediaList.push(new Series(element));
        });

        this.mediaRoute.openSearch(input);
        this.inputElement.nativeElement.value = input;
        this.mediaList.set(mediaList);
      });
  }

  checkInput(input: string): boolean {
    if (input === undefined) return true;
    if (input === '') return false;

    const trimmed = input.trim();
    if (trimmed.indexOf('/') !== -1) return true;

    return false;
  }

  isGenreActive(genre: string): boolean {
    const genreType = genre as MediaGenre;
    return this.genreList.has(genreType);
  }

  addGenreToList(genre: string, input: string) {
    const genreType = genre as MediaGenre;
    if (this.isGenreActive(genre)) this.genreList.delete(genreType);
    else this.genreList.add(genreType);

    this.setMediaList(input);
  }

  getAllGenres(): string[] {
    return Object.values(MediaGenre);
  }
}
