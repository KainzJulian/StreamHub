import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { Episode } from '../../../types/seriesEpisode';
import { MediaRouterService } from '../../../services/media-router.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Icon } from '../icon/icon';
import { environment } from '../../../../environment';

@Component({
  selector: 'episode-card',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './episode-card.html',
  styleUrl: './episode-card.scss',
})
export class EpisodeCard implements OnInit {
  @Input() episode?: Episode;
  @Input() isSelected: boolean = false;

  @Output() onClick = new EventEmitter<Episode>();

  public progressBarWidth = signal<number>(0);

  seriesID!: string | null;

  constructor(
    private elRef: ElementRef,
    private mediaRouterService: MediaRouterService,
    private route: ActivatedRoute
  ) {
    this.seriesID = this.route.snapshot.paramMap.get('seriesID');
  }

  ngOnInit(): void {
    if (!this.episode?.id) throw new Error('Episode ID not set');

    this.progressBarWidth.set(
      (this.episode.durationWatched / this.episode.duration) * 100
    );

    this.elRef.nativeElement.style.setProperty(
      '--thumbnail-path',
      `url("http://${environment.backend.IP}:${environment.backend.PORT}/api/episodes/${this.episode?.id}/thumbnail_preview")`
    );
  }

  clickButton() {
    if (!this.episode) return;

    this.mediaRouterService.openSeriesPlayer(
      this.seriesID == null ? '' : this.seriesID,
      this.episode.id
    );

    this.onClick.emit(this.episode);
  }

  isInProgress(): boolean {
    return this.progressBarWidth() <= 100 && this.progressBarWidth() > 0;
  }
}
