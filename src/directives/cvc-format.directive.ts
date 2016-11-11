import { Directive, ElementRef, HostListener } from '@angular/core';
import { CreditCard } from '../shared/credit-card';

@Directive({
  selector: '[ccCVC]'
})

export class CvcFormatDirective {

  public target;

  constructor(private el: ElementRef) {
    this.target = this.el.nativeElement;
  }

  @HostListener('keypress', ['$event']) onKeypress(e) {
    if (!CreditCard.restrictNumeric(e) && !CreditCard.restrictCvc(e.which, this.target)) {
      e.preventDefault();
    }
  }
  @HostListener('paste', ['$event']) onPaste(e) {
    this.reformatCvc(e)
  }
  @HostListener('change', ['$event']) onChange(e) {
    this.reformatCvc(e)
  }
  @HostListener('input', ['$event']) onInput(e) {
    this.reformatCvc(e)
  }


  private reformatCvc(e) {
    setTimeout(() => {
      let val = CreditCard.replaceFullWidthChars(this.target.value);
      val = val.replace(/\D/g, '').slice(0, 4);
      this.target.selectionStart = this.target.selectionEnd = CreditCard.safeVal(val, this.target);
    });
  }

}
