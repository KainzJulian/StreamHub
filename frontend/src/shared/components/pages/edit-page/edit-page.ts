import { Component, ElementRef, ViewChild } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { BaseButton } from '../../atoms/base-button/base-button';
import { Icon } from '../../atoms/icon/icon';
import { GenreList } from '../../molecules/genre-list/genre-list';
import { MediaGenre } from '../../../types/genre';
import { Genre } from '../../atoms/genre/genre';

@Component({
  selector: 'edit-page',
  standalone: true,
  imports: [HomeTemplate, BaseButton, Icon, GenreList, Genre],
  templateUrl: './edit-page.html',
  styleUrl: './edit-page.scss',
})
export class EditPage {
  @ViewChild('inputTitle') inputTitle!: ElementRef;
  @ViewChild('inputDesc') inputDesc!: ElementRef;
  @ViewChild('inputComplete') inputComplete!: ElementRef;
  @ViewChild('inputRating') inputRating!: ElementRef;

  private genreList = new Set<string>();

  onCancelPressed() {
    throw new Error('Method not implemented.');
  }

  checkRating(): number {
    let rating = this.inputRating.nativeElement.value;

    if (typeof rating !== 'number' && isNaN(rating)) {
      this.inputRating.nativeElement.value = 0;
      return 0;
    }

    if (rating < 0) rating = 0;
    else if (rating > 100) rating = 100;

    this.inputRating.nativeElement.value = Number(rating);
    return rating;
  }

  onSavePressed() {
    const title = this.inputTitle.nativeElement.value;
    const description = this.inputDesc.nativeElement.value;
    const complete = this.inputComplete.nativeElement.checked;
    const rating = this.checkRating();

    console.log(title);
    console.log(description);
    console.log(complete);
    console.log(rating);
  }

  getAllGenres(): string[] {
    return Object.values(MediaGenre);
  }

  addGenreToList(genre: string) {
    this.genreList.add(genre);
    console.log(this.genreList);
  }
}
