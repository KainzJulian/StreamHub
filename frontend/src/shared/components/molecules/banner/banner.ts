import { Component } from '@angular/core';
import { BaseButton } from '../../atoms/base-button/base-button';

@Component({
  selector: 'banner',
  standalone: true,
  imports: [BaseButton],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
})
export class Banner {}
