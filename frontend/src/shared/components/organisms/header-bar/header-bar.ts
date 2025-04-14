import { Component } from '@angular/core';
import { BaseButton } from '../../atoms/base-button/base-button';
import { Icon } from '../../atoms/icon/icon';

@Component({
  selector: 'header-bar',
  standalone: true,
  imports: [BaseButton, Icon],
  templateUrl: './header-bar.html',
  styleUrl: './header-bar.scss',
})
export class HeaderBar {}
