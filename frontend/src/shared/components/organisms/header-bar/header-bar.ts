import { Component } from '@angular/core';
import { BaseButton } from '../../atoms/base-button/base-button';
import { Icon } from '../../atoms/icon/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'header-bar',
  standalone: true,
  imports: [BaseButton, Icon, RouterLink, RouterLinkActive],
  templateUrl: './header-bar.html',
  styleUrl: './header-bar.scss',
})
export class HeaderBar {
  openSearch() {
    throw new Error('Method not implemented.');
  }
}
