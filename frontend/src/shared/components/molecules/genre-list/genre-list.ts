import { Component, Input } from '@angular/core';
import { MediaGenre } from '../../../types/genre';
import { Genre } from '../../atoms/genre/genre';

@Component({
  selector: 'genre-list',
  standalone: true,
  imports: [Genre],
  templateUrl: './genre-list.html',
  styleUrl: './genre-list.scss',
})
export class GenreList {
  @Input() genres: MediaGenre[] | undefined | null;
}
