import {
  Component,
  ElementRef,
  HostListener,
  signal,
  ViewChild,
} from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { BaseButton } from '../../atoms/base-button/base-button';
import { Icon } from '../../atoms/icon/icon';
import { MediaGenre } from '../../../types/genre';
import { Genre } from '../../atoms/genre/genre';
import { CommonModule, Location } from '@angular/common';
import { Media } from '../../../types/media';
import { MediaService } from '../../../services/media.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'edit-page',
  standalone: true,
  imports: [FormsModule, CommonModule, HomeTemplate, BaseButton, Icon, Genre],
  templateUrl: './edit-page.html',
  styleUrl: './edit-page.scss',
})
export class EditPage {
  @ViewChild('inputTitle') inputTitle!: ElementRef;
  @ViewChild('inputDesc') inputDesc!: ElementRef;
  @ViewChild('inputComplete') inputComplete!: ElementRef;
  @ViewChild('inputRating') inputRating!: ElementRef;

  public title: string = '';
  public description: string = '';
  public complete: boolean = false;
  public rating: number = 0;

  private genreList = new Set<MediaGenre>();

  public media = signal<Media | null>(null);

  constructor(
    private mediaService: MediaService,
    private activeRoute: ActivatedRoute,
    private location: Location
  ) {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (!id) throw new Error('ID is null or undefined expected value');

    this.mediaService.getMedia(id).subscribe((response) => {
      const data = response.data;
      this.media.set(data);
      this.title = data.title ?? '';
      this.description = data.description ?? '';
      this.complete = data.isComplete;
      this.rating = data.rating ?? 0;

      data.genreList?.forEach((genre) => {
        this.genreList.add(genre);
      });

      console.log(this.genreList);
    });
  }

  checkMediaType(type: string): boolean {
    return this.media()?.type === type;
  }

  onCancelPressed() {
    this.location.back();
  }

  getRating(): number {
    if (typeof this.rating !== 'number' && isNaN(this.rating)) {
      this.rating = 0;
      return this.rating;
    }

    if (this.rating < 0) this.rating = 0;
    else if (this.rating > 100) this.rating = 100;

    return this.rating;
  }

  onSavePressed() {
    const media = this.media();
    if (!media) throw new Error('Media is null');

    media.description = this.description;
    media.title = this.title;
    media.rating = this.getRating();
    media.genreList = Array.from(this.genreList);
    media.isComplete = this.complete;

    this.mediaService.updateData(media).subscribe((response) => {
      if (response.error) throw new Error(response.error);

      this.location.back();
    });
  }

  getAllGenres(): string[] {
    return Object.values(MediaGenre);
  }

  addGenreToList(genre: string) {
    const genreType = genre as MediaGenre;
    if (this.isGenreActive(genre)) this.genreList.delete(genreType);
    else this.genreList.add(genreType);
  }

  isGenreActive(genre: string): boolean {
    const genreType = genre as MediaGenre;
    return this.genreList.has(genreType);
  }

  @HostListener('window:keydown', ['$event'])
  eventName(event: KeyboardEvent) {
    const keyPressed = event.key.toLowerCase();

    if ((event.ctrlKey || event.metaKey) && keyPressed === 's') {
      event.preventDefault();
      this.onSavePressed();
    }

    if (keyPressed === 'escape') {
      event.preventDefault();
      this.onCancelPressed();
    }
  }
}
