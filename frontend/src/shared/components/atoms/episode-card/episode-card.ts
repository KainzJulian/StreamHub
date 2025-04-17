import { Component, Input } from '@angular/core';
import { Episode } from '../../../types/series';
import { MediaRouterService } from '../../../services/media-router.service';

@Component({
  selector: 'episode-card',
  standalone: true,
  imports: [],
  templateUrl: './episode-card.html',
  styleUrl: './episode-card.scss',
})
export class EpisodeCard {
  @Input() episode?: Episode;

  constructor(private mediaRouterService: MediaRouterService) {}

  openPlayer() {
    if (this.episode) this.mediaRouterService.openPlayer(this.episode.id, true);
  }
}
