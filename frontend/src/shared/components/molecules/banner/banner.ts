import { Component, ElementRef, Input, OnInit } from '@angular/core';
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
export class Banner implements OnInit {
  @Input() media: Media | null = null;

  constructor(
    private elRef: ElementRef,
    private mediaRouterService: MediaRouterService,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    if (!this.media?.id) throw new Error('Media ID not set');

    const mediaType = this.media.getMediaType();
    let type = '';

    if (mediaType == 'Movie') type = 'movies';
    if (mediaType == 'Series') type = 'series';
    if (mediaType == 'Episode') type = 'episodes';

    this.elRef.nativeElement.style.setProperty(
      '--thumbnail-path',
      `url("http://localhost:8000/api/${type}/${this.media?.id}/thumbnail_banner")`
    );
  }

  playMedia() {
    if (this.media == null) return;

    this.mediaService.currentMedia.set(this.media);
    this.mediaRouterService.openMediaPlayer(this.media);
  }
}
