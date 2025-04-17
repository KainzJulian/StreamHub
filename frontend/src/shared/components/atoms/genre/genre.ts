import { Component, Input } from '@angular/core';
import { MediaGenre } from '../../../types/genre';

@Component({
  selector: 'genre',
  standalone: true,
  imports: [],
  templateUrl: './genre.html',
  styleUrl: './genre.scss',
})
export class Genre {
  @Input() genre?: MediaGenre;
}
