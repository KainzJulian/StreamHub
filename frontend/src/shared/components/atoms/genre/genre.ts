import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'genre',
  standalone: true,
  imports: [],
  templateUrl: './genre.html',
  styleUrl: './genre.scss',
})
export class Genre {
  @Input() genre?: string;

  @Output() onClick = new EventEmitter<string>();

  onGenreClicked() {
    if (!this.genre)
      throw new Error('onGenreClicked not triggered: this.genre is undefined');

    this.onClick.emit(this.genre);
  }
}
