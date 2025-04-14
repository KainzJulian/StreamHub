import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'base-button',
  standalone: true,
  imports: [],
  templateUrl: './base-button.html',
  styleUrl: './base-button.scss',
})
export class BaseButton {
  @Output() onClick = new EventEmitter<void>();
}
