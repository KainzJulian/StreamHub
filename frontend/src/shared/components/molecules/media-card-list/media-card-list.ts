import { Component, Input } from '@angular/core';
import { Media } from '../../../types/media';
import { MediaCard } from '../../atoms/media-card/media-card';

@Component({
  selector: 'media-card-list',
  standalone: true,
  imports: [MediaCard],
  templateUrl: './media-card-list.html',
  styleUrl: './media-card-list.scss',
})
export class MediaCardList {
  @Input() mediaList?: Media[];

  @Input() title: string = '';
}
