import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { CreditCard } from '../credit-card';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[ccCVC]',
})

export class CvcFormatDirective {
  public target: HTMLInputElement;

  constructor(
    private el: ElementRef,
    @Self() @Optional() private control: NgControl,
  ) {
    this.target = this.el.nativeElement;
  }

  /**
   * Updates the value to target element, or FormControl if exists.
   * @param value New input value.
   */
  private updateValue(value: string) {
    if (this.control) {
      this.control.control.setValue(value);
    } else {
      this.target.value = value;
    }
  }

  @HostListener('keypress', ['$event'])
  public onKeypress(e: KeyboardEvent) {
    if (!CreditCard.restrictNumeric(e) && !CreditCard.restrictCvc(e.which, this.target)) {
      e.preventDefault();
    }
  }

  @HostListener('paste')
  public onPaste() {
    this.reformatCvc();
  }
  @HostListener('change')
  public onChange() {
    this.reformatCvc();
  }
  @HostListener('input')
  public onInput() {
    this.reformatCvc();
  }

  private reformatCvc() {
    setTimeout(() => {
      let val = CreditCard.replaceFullWidthChars(this.target.value);
      val = val.replace(/\D/g, '').slice(0, 4);
      const oldVal = this.target.value;
      if (val !== oldVal) {
        this.target.selectionStart = this.target.selectionEnd = CreditCard.safeVal(val, this.target, (safeVal => {
          this.updateValue(safeVal);
        }));
      }
    });
  }
}
