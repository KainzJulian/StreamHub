import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Media } from '../../../types/media';
import { MediaCard } from '../../atoms/media-card/media-card';
import { CommonModule } from '@angular/common';
import { BaseButton } from '../../atoms/base-button/base-button';

@Component({
  selector: 'media-card-list',
  standalone: true,
  imports: [MediaCard, CommonModule, BaseButton],
  templateUrl: './media-card-list.html',
  styleUrl: './media-card-list.scss',
})
export class MediaCardList {
  @Input() mediaList: Media[] | null = null;
  @Input() mediaListTitle: string = '';

  @Output() public onShowAllClicked = new EventEmitter<void>();

  showAllClicked() {
    this.onShowAllClicked.emit();
  }
}
