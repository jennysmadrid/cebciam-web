import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[numberOnly]'
})
export class NumberOnlyDirective {

  @Input() allowDecimal: Boolean = false;
  @Input() allowNegative: Boolean = false;

  // Allow decimal numbers and negative values
  private filter: RegExp = new RegExp(/^[0-9]+([0-9]*){0,1}$/g);

  // Allow key codes for special events. Reflect :
  private specialKeys: Array<string> = ['Backspace', 'End', 'Home'];

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {

    // Allow Backspace, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    const match = String(next).match(this.filter);

    if (next && !match) {
      event.preventDefault();
    }

  }

}
