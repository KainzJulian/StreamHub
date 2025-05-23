import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BaseButton } from '../../atoms/base-button/base-button';
import { Icon } from '../../atoms/icon/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MediaRouterService } from '../../../services/media-router.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'header-bar',
  standalone: true,
  imports: [CommonModule, BaseButton, Icon, RouterLink, RouterLinkActive],
  templateUrl: './header-bar.html',
  styleUrl: './header-bar.scss',
})
export class HeaderBar {
  @ViewChild('input') input!: ElementRef;
  @Input() showSearch: boolean = false;

  constructor(private mediaRouter: MediaRouterService) {}

  openSearch(input: string) {
    if (input === '') return;
    this.mediaRouter.openSearch(input);
  }
}
