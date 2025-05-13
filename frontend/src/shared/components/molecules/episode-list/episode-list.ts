import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EpisodeCard } from '../../atoms/episode-card/episode-card';
import { Episode } from '../../../types/seriesEpisode';
import { CommonModule } from '@angular/common';
import { MediaService } from '../../../services/media.service';

@Component({
  selector: 'episode-list',
  standalone: true,
  imports: [CommonModule, EpisodeCard],
  templateUrl: './episode-list.html',
  styleUrl: './episode-list.scss',
})
export class EpisodeList {
  @Input() episodeList?: Episode[] | null;
  @Output() onClickCard = new EventEmitter<Episode>();

  constructor(public mediaService: MediaService) {}

  clickCard(episode: Episode) {
    this.onClickCard.emit(episode);
  }
}
