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

@Component({
  selector: 'search-page',
  standalone: true,
  imports: [CommonModule, HomeTemplate, MediaCardList, BaseButton, Icon],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage implements OnInit {
  public input: string = '';

  @ViewChild('input') inputElement!: ElementRef;

  public mediaList = signal<Media[] | null>(null);

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private mediaRoute: MediaRouterService
  ) {}

  ngOnInit(): void {
    const input = this.route.snapshot.paramMap.get('input');
    if (input === null) throw new Error('Search is empty');

    this.route.params.subscribe((params) => {
      const search = params['input'];
      this.setMediaList(search);
    });
  }

  public setMediaList(input: string) {
    if (this.checkInput(input)) return;

    this.mediaService.getSearch(input).subscribe((response) => {
      console.log(response);

      const mediaList: Media[] = [];

      response.data.forEach((element) => {
        const type = element.type;
        if (type === 'Movie') mediaList.push(new Movie(element));
        if (type === 'Series') mediaList.push(new Series(element));
      });

      this.mediaRoute.openSearch(input);
      this.inputElement.nativeElement.value = input;
      this.mediaList.set(mediaList);
      console.log('medialist', mediaList);
    });
  }

  checkInput(input: string): boolean {
    const trimmed = input.trim();
    if (trimmed === '') return true;
    if (trimmed.indexOf('/') !== -1) return true;

    return false;
  }
}
