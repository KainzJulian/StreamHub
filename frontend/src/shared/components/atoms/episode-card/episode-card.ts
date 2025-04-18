import { Component, Input } from '@angular/core';
import { Episode } from '../../../types/series';
import { MediaRouterService } from '../../../services/media-router.service';
import { MediaService } from '../../../services/media.service';

@Component({
  selector: 'episode-card',
  standalone: true,
  imports: [],
  templateUrl: './episode-card.html',
  styleUrl: './episode-card.scss',
})
export class EpisodeCard {
  @Input() episode?: Episode;

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
