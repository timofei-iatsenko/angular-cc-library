import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { CreditCard } from '../credit-card';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[ccExp]',
})
export class ExpiryFormatDirective {
  private target: HTMLInputElement;

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
    if (CreditCard.restrictNumeric(e)) {
      if (CreditCard.restrictExpiry(e.which, this.target)) {
        this.formatExpiry(e);
        this.formatForwardSlashAndSpace(e);
        this.formatForwardExpiry(e);
      }
    } else {
      e.preventDefault();
      return false;
    }
  }

  @HostListener('keydown', ['$event'])
  public onKeydown(e: KeyboardEvent) {
    if (CreditCard.restrictNumeric(e) && CreditCard.restrictExpiry(e.which, this.target)) {
      this.formatBackExpiry(e);
    }
  }

  @HostListener('change')
  public onChange() {
    this.reformatExpiry();
  }

  @HostListener('input')
  public onInput() {
    this.reformatExpiry();
  }

  private formatExpiry(e: KeyboardEvent) {
    const digit = String.fromCharCode(e.which);
    const val = `${this.target.value}${digit}`;

    if (!/^\d+$/.test(digit)) {
      return;
    }

    if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
      e.preventDefault();
      this.updateValue(`0${val} / `);
    } else if (/^\d\d$/.test(val)) {
      e.preventDefault();
      const m1 = parseInt(val[0], 10);
      const m2 = parseInt(val[1], 10);
      if (m2 > 2 && m1 !== 0) {
        this.updateValue(`0${m1} / ${m2}`);
      } else {
        this.updateValue(`${val} / `);
      }

    }
  }

  private formatForwardSlashAndSpace(e: KeyboardEvent) {
    const which = String.fromCharCode(e.which);
    const val = this.target.value;

    if (!(which === '/' || which === ' ')) {
      return false;
    }
    if (/^\d$/.test(val) && val !== '0') {
      this.updateValue(`0${val} / `);
    }
  }

  private formatForwardExpiry(e: KeyboardEvent) {
    const digit = String.fromCharCode(e.which);
    const val = this.target.value;

    if (!/^\d+$/.test(digit) && /^\d\d$/.test(val)) {
      this.updateValue(this.target.value = `${val} / `);
    }
  }

  private formatBackExpiry(e: KeyboardEvent) {
    const val = this.target.valueOf as unknown as string;

    if (e.which !== 8) {
      return;
    }
    if ((this.target.selectionStart != null) && this.target.selectionStart !== val.length) {
      return;
    }
    if (/\d\s\/\s$/.test(val)) {
      e.preventDefault();
      this.updateValue(val.replace(/\d\s\/\s$/, ''));
    }
  }

  private reformatExpiry() {
    const val = CreditCard.formatExpiry(
      CreditCard.replaceFullWidthChars(this.target.value),
    );

    const oldVal = this.target.value;
    if (val !== oldVal) {
      this.target.selectionStart = this.target.selectionEnd = CreditCard.safeVal(val, this.target, (safeVal => {
        this.updateValue(safeVal);
      }));
    }
  }
}
