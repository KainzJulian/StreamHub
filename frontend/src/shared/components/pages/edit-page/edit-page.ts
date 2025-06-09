import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { BaseButton } from '../../atoms/base-button/base-button';
import { Icon } from '../../atoms/icon/icon';
import { MediaGenre } from '../../../types/genre';
import { Genre } from '../../atoms/genre/genre';
import { CommonModule } from '@angular/common';
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

  private genreList = new Set<string>();

  public media = signal<Media | null>(null);

  constructor(
    private mediaService: MediaService,
    private activeRoute: ActivatedRoute
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
    });
  }

  checkMediaType(type: string): boolean {
    return this.media()?.type === type;
  }

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
    if (this.isGenreActive(genre)) this.genreList.delete(genre);
    else this.genreList.add(genre);
  }

  isGenreActive(genre: string): boolean {
    return this.genreList.has(genre);
  }
}
