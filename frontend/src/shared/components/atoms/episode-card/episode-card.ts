import { Component, Input } from '@angular/core';
import { Episode } from '../../../types/series';
import { MediaRouterService } from '../../../services/media-router.service';
import { MediaService } from '../../../services/media.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'episode-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episode-card.html',
  styleUrl: './episode-card.scss',
})
export class EpisodeCard {
  @Input() episode?: Episode;
  @Input() isSelected: boolean = false;

  constructor(
    private mediaRouterService: MediaRouterService,
    private mediaService: MediaService
  ) {}

  openPlayer() {
    if (this.episode) {
      this.mediaService.currentEpisode.set(this.episode);
      this.mediaService.currentSeason.set(this.episode.season);

      this.mediaRouterService.openPlayer(this.episode.id, true);
    }
  }
}
