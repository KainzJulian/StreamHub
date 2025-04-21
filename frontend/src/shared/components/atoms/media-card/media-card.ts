import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { Media } from '../../../types/media';
import { CommonModule } from '@angular/common';
import { MediaRouterService } from '../../../services/media-router.service';
import { MediaService } from '../../../services/media.service';

@Component({
  selector: 'media-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss',
})
export class MediaCard {
  @Input() media: Media | null = null;

  constructor(
    private mediaRouterService: MediaRouterService,
    private mediaService: MediaService,
    private host: ElementRef,
    private renderer: Renderer2
  ) {}

  openPlayer() {
    if (this.media) {
      this.mediaService.currentMedia.set(this.media);
      this.mediaRouterService.openMediaPlayer(this.media);
    }
  }
}
