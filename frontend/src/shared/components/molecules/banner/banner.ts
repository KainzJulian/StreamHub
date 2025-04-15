import { Component, Input } from '@angular/core';
import { BaseButton } from '../../atoms/base-button/base-button';
import { Media } from '../../../types/media';
import { CommonModule } from '@angular/common';
import { Genre } from '../../atoms/genre/genre';

@Component({
  selector: 'banner',
  standalone: true,
  imports: [BaseButton, CommonModule, Genre],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
})
export class Banner {
  @Input() media: Media | null = null;

  playMedia() {
    throw new Error('Method not implemented.');
  }
}
