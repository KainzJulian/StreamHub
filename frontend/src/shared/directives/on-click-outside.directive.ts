import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[onClickOutside]',
  standalone: true,
})
export class OnClickOutsideDirective {
  @Output() onClickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    console.log('Click: ', clickedInside);

    if (!clickedInside) {
      this.onClickOutside.emit();
    }
  }
}
