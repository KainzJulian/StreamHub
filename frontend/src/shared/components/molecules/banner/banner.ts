import { Component, Input } from '@angular/core';
import { BaseButton } from '../../atoms/base-button/base-button';
import { Media } from '../../../types/media';
import { CommonModule } from '@angular/common';
import { Genre } from '../../atoms/genre/genre';
import { MediaRouterService } from '../../../services/media-router.service';
import { GenreList } from '../genre-list/genre-list';

@Component({
  selector: 'banner',
  standalone: true,
  imports: [BaseButton, CommonModule, Genre, GenreList],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
})
export class Banner {
  @Input() media: Media | null = null;

  constructor(private mediaRouterService: MediaRouterService) {}

  playMedia() {
    if (this.media) this.mediaRouterService.openMediaPlayer(this.media);
  }
}
