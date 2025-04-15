import { Component, Input } from '@angular/core';
import { Genre as GenreType } from '../../../types/genre';

@Component({
  selector: 'genre',
  standalone: true,
  imports: [],
  templateUrl: './genre.html',
  styleUrl: './genre.scss',
})
export class Genre {
  @Input() genreType?: GenreType;
}
