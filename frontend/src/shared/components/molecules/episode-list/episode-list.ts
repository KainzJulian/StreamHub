import { Component, Input } from '@angular/core';
import { EpisodeCard } from '../../atoms/episode-card/episode-card';
import { Episode } from '../../../types/series';
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

  constructor(public mediaService: MediaService) {}
}
