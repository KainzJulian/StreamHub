import { Component, Input } from '@angular/core';
import { BaseButton } from '../../atoms/base-button/base-button';
import { Media } from '../../../types/media';
import { CommonModule } from '@angular/common';
import { MediaRouterService } from '../../../services/media-router.service';
import { GenreList } from '../genre-list/genre-list';
import { MediaService } from '../../../services/media.service';

@Component({
  selector: 'banner',
  standalone: true,
  imports: [BaseButton, CommonModule, GenreList],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
})
export class Banner {
  @Input() media: Media | null = null;

  constructor(
    private mediaRouterService: MediaRouterService,
    private mediaService: MediaService
  ) {}

  playMedia() {
    if (this.media == null) return;

    this.mediaService.currentMedia.set(this.media);
    this.mediaRouterService.openMediaPlayer(this.media);
  }
}
