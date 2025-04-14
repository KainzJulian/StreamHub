import { Component } from '@angular/core';
import { HeaderBar } from '../../organisms/header-bar/header-bar';

@Component({
  selector: 'home-template',
  standalone: true,
  imports: [HeaderBar],
  templateUrl: './home-template.html',
  styleUrl: './home-template.scss',
})
export class HomeTemplate {}
