import { Component, Input } from '@angular/core';
import { Media } from '../../../types/media';
import { CommonModule } from '@angular/common';
import { MediaRouterService } from '../../../services/media-router.service';

@Component({
  selector: 'media-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss',
})
export class MediaCard {
  @Input() media: Media | null = null;

  constructor(private mediaRouterService: MediaRouterService) {}

  openPlayer() {
    if (this.media) this.mediaRouterService.openMediaPlayer(this.media);
  }
}
