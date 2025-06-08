import { Component, Input } from '@angular/core';
import { Genre } from '../../atoms/genre/genre';

@Component({
  selector: 'genre-list',
  standalone: true,
  imports: [Genre],
  templateUrl: './genre-list.html',
  styleUrl: './genre-list.scss',
})
export class GenreList {
  @Input() genres: string[] | undefined | null;
}
