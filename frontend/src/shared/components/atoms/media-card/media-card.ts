import { Component, Input } from '@angular/core';
import { Media } from '../../../types/media';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'media-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss',
})
export class MediaCard {
  @Input() media?: Media;
}
