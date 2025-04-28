import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Episode } from '../../../types/series';
import { MediaRouterService } from '../../../services/media-router.service';
import { MediaService } from '../../../services/media.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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

  @Output() onClick = new EventEmitter<Episode>();

  seriesID!: string | null;

  constructor(
    private mediaRouterService: MediaRouterService,
    private mediaService: MediaService,
    private route: ActivatedRoute
  ) {
    this.seriesID = this.route.snapshot.paramMap.get('seriesID');
  }

  clickButton() {
    console.log('Click Button', this.episode);

    if (this.episode) {
      this.mediaRouterService.openPlayer(
        this.episode.id,
        true,
        this.seriesID == null ? '' : this.seriesID
      );

      this.onClick.emit(this.episode);
    }
  }
}
