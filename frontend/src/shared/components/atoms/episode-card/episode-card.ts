import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Episode } from '../../../types/seriesEpisode';
import { MediaRouterService } from '../../../services/media-router.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from '../../../services/media.service';

@Component({
  selector: 'episode-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episode-card.html',
  styleUrl: './episode-card.scss',
})
export class EpisodeCard implements OnInit {
  @Input() episode?: Episode;
  @Input() isSelected: boolean = false;

  @Output() onClick = new EventEmitter<Episode>();

  seriesID!: string | null;

  constructor(
    private elRef: ElementRef,
    private mediaRouterService: MediaRouterService,
    private route: ActivatedRoute,
    private mediaService: MediaService
  ) {
    this.seriesID = this.route.snapshot.paramMap.get('seriesID');
  }

  ngOnInit(): void {
    if (!this.episode?.id) throw new Error('Episode ID not set');

    this.elRef.nativeElement.style.setProperty(
      '--thumbnail-path',
      `url("http://localhost:8000/api/episodes/${this.episode?.id}/thumbnail_preview")`
    );
  }

  clickButton() {
    console.log('Click Button', this.episode);

    if (this.episode) {
      this.mediaService.addToWatchHistory(this.episode, 'Episode');

      this.mediaRouterService.openSeriesPlayer(
        this.seriesID == null ? '' : this.seriesID,
        this.episode.id
      );

      this.onClick.emit(this.episode);
    }
  }
}
