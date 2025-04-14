import { Component } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [HomeTemplate],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
