import { Component, Input } from '@angular/core';
import { HeaderBar } from '../../organisms/header-bar/header-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home-template',
  standalone: true,
  imports: [CommonModule, HeaderBar],
  templateUrl: './home-template.html',
  styleUrl: './home-template.scss',
})
export class HomeTemplate {
  @Input() showSearch: boolean = true;
  @Input() showEditButton: boolean = false;
  @Input() mediaID: string | undefined;
}
