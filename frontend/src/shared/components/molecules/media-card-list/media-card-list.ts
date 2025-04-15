import { Component, Input } from '@angular/core';
import { Media } from '../../../types/media';
import { MediaCard } from '../../atoms/media-card/media-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'media-card-list',
  standalone: true,
  imports: [MediaCard, CommonModule],
  templateUrl: './media-card-list.html',
  styleUrl: './media-card-list.scss',
})
export class MediaCardList {
  @Input() mediaList: Media[] | null = null;

  @Input() title: string = '';
}
