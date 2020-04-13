import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { CreditCard } from '../credit-card';
import { NgControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: '[ccNumber]',
  exportAs: 'ccNumber',
})
export class CreditCardFormatDirective {
  private target: HTMLInputElement;
  private cards = CreditCard.cards();

  public resolvedScheme$ = new BehaviorSubject<string>('unknown');

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
      if (CreditCard.isCardNumber(e.which, this.target)) {
        this.formatCardNumber(e);
      }
    } else {
      e.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  public onKeydown(e: KeyboardEvent) {
    this.formatBackCardNumber(e);
    this.reFormatCardNumber();
  }

  @HostListener('keyup')
  public onKeyup() {
    this.setCardType();
  }

  @HostListener('paste')
  public onPaste() {
    this.reFormatCardNumber();
  }

  @HostListener('change')
  public onChange() {
    this.reFormatCardNumber();
  }

  @HostListener('input')
  public onInput() {
    this.reFormatCardNumber();
    this.setCardType();
  }

  private formatCardNumber(e: KeyboardEvent) {
    const digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }

    const value = this.target.value;
    const card = CreditCard.cardFromNumber(value + digit);
    const length = (value.replace(/\D/g, '') + digit).length;
    const upperLength = card ? card.length[card.length.length - 1] : 19;

    if (length >= upperLength) {
      return;
    }
  }

  private formatBackCardNumber(e: KeyboardEvent) {
    const value = this.target.value;
    const selStart = this.target.selectionStart;

    if (e.which !== 8) {
      return;
    }

    if (selStart != null
      && selStart === this.target.selectionEnd
      && selStart > 0
      && selStart !== value.length
      && value[selStart - 1] === ' ') {
      e.preventDefault();
      if (selStart <= 2) {
        this.updateValue(value.slice(selStart));
        this.target.selectionStart = 0;
        this.target.selectionEnd = 0;
      } else {
        this.updateValue(value.slice(0, selStart - 2) + value.slice(selStart));
        this.target.selectionStart = selStart - 2;
        this.target.selectionEnd = selStart - 2;
      }
    }
  }

  private setCardType() {
    const cardType = CreditCard.cardType(this.target.value) || 'unknown';

    this.resolvedScheme$.next(cardType);

    if (!this.target.classList.contains(cardType)) {
      this.cards.forEach((card) => {
        this.target.classList.remove(card.type);
      });

      this.target.classList.remove('unknown');
      this.target.classList.add(cardType);
      this.target.classList.toggle('identified', cardType !== 'unknown');
    }
  }

  private reFormatCardNumber() {
    const value = CreditCard.formatCardNumber(
      CreditCard.replaceFullWidthChars(this.target.value),
    );
    const oldValue = this.target.value;
    if (value !== oldValue) {
      this.target.selectionStart = this.target.selectionEnd = CreditCard.safeVal(value, this.target, (safeVal => {
        this.updateValue(safeVal);
      }));
    }
  }
}
