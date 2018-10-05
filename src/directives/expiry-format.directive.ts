import { Directive, ElementRef, HostListener } from '@angular/core';
import { CreditCard } from '../shared/credit-card';

@Directive({
  selector: '[ccExp]'
})

export class ExpiryFormatDirective {

  public target;

  constructor(private el: ElementRef) {
    this.target = this.el.nativeElement;
  }

  @HostListener('keypress', ['$event']) onKeypress(e) {
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
  @HostListener('keydown', ['$event']) onKeydown(e) {
    if (CreditCard.restrictNumeric(e) && CreditCard.restrictExpiry(e.which, this.target)) {
      this.formatBackExpiry(e);
    }
  }
  @HostListener('change', ['$event']) onChange(e) {
    this.reformatExpiry(e);
  }
  @HostListener('input', ['$event']) onInput(e) {
    this.reformatExpiry(e);
  }

  private formatExpiry(e) {
    let digit = String.fromCharCode(e.which),
        val   = `${this.target.value}${digit}`;

    if (!/^\d+$/.test(digit)) {
      if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
        e.preventDefault();
        setTimeout(() => {
          this.target.value = `0${val} / `;
        });
      } else if (/^\d\d$/.test(val)) {
        e.preventDefault();
        setTimeout(() => {
          let m1 = parseInt(val[0], 10),
              m2 = parseInt(val[1], 10);
          if (m2 > 2 && m1 !== 0) {
            this.target.value = `0${m1} / ${m2}`;
          } else {
            this.target.value = `${val} / `;
          }
        });
      }
    }
  }

  private formatForwardSlashAndSpace(e) {
    let which = String.fromCharCode(e.which),
        val   = this.target.value;

    if (!(which === '/' || which === ' ')) {
      return false;
    }
    if (/^\d$/.test(val) && val !== '0') {
      this.target.value = `0${val} / `;
    }
  }

  private formatForwardExpiry(e) {
    let digit = String.fromCharCode(e.which),
        val   = this.target.value;

    if (!/^\d+$/.test(digit) && /^\d\d$/.test(val)) {
      this.target.value = `${val} / `;
    }
  }

  private formatBackExpiry(e) {
    let val = this.target.valueOf;

    if (e.which !== 8) {
      return;
    }
    if ((this.target.selectionStart != null) && this.target.selectionStart !== val.length) {
      return;
    }
    if (/\d\s\/\s$/.test(val)) {
      e.preventDefault();
      setTimeout(function() {
        this.target.value = val.replace(/\d\s\/\s$/, '');
      });
    }
  }

  private reformatExpiry(e) {
    setTimeout(() => {
      let val = this.target.value;
      val = CreditCard.replaceFullWidthChars(val);
      val = CreditCard.formatExpiry(val);
      if (this.target === document.activeElement) {
        this.target.selectionStart = this.target.selectionEnd = CreditCard.safeVal(val, this.target);
      }
    });
  }

}
