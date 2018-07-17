import { Directive, ElementRef, HostListener } from '@angular/core';
import { CreditCard } from '../shared/credit-card';

@Directive({
  selector: '[ccNumber]'
})

export class CreditCardFormatDirective {

  public target;
  private cards: Array<any>;

  constructor(private el: ElementRef) {
    this.target = this.el.nativeElement;
    this.cards = CreditCard.cards();
  }

  @HostListener('keypress', ['$event']) onKeypress(e) {
    if (CreditCard.restrictNumeric(e)) {
      if (CreditCard.isCardNumber(e.which, this.target)) {
        this.formatCardNumber(e);
      }
    } else {
      e.preventDefault();
      return false;
    }

  }
  @HostListener('keydown', ['$event']) onKeydown(e) {
    this.formatBackCardNumber(e);
    this.reFormatCardNumber(e);
  }
  @HostListener('keyup', ['$event']) onKeyup(e) {
    this.setCardType(e);
  }
  @HostListener('paste', ['$event']) onPaste(e) {
    this.reFormatCardNumber(e);
  }
  @HostListener('change', ['$event']) onChange(e) {
    this.reFormatCardNumber(e);
  }
  @HostListener('input', ['$event']) onInput(e) {
    this.reFormatCardNumber(e);
    this.setCardType(e);
  }

  private formatCardNumber(e) {
    let card,
        digit,
        length,
        upperLength,
        value;

    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }

    value = this.target.value;

    card = CreditCard.cardFromNumber(value + digit);

    length = (value.replace(/\D/g, '') + digit).length;

    upperLength = 19;

    if (card) {
      upperLength = card.length[card.length.length - 1];
    }

    if (length >= upperLength) {
      return;
    }
  }

  private formatBackCardNumber(e) {
    let value = this.target.value;
    let selStart = this.target.selectionStart;

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
        this.target.value = value.slice(selStart);
        this.target.selectionStart = 0;
        this.target.selectionEnd = 0;
      } else {
        this.target.value = value.slice(0, selStart - 2) + value.slice(selStart);
        this.target.selectionStart = selStart - 2;
        this.target.selectionEnd = selStart - 2;
      }
    }
}

  private setCardType(e) {
    let card,
        val      = this.target.value,
        cardType = CreditCard.cardType(val) || 'unknown';

    if (!this.target.classList.contains(cardType)) {

      for (let i = 0, len = this.cards.length; i < len; i++) {
        card = this.cards[i];
        this.target.classList.remove(card.type);
      }

      this.target.classList.remove('unknown');
      this.target.classList.add(cardType);
      this.target.classList.toggle('identified', cardType !== 'unknown');
    }
  }

  private reFormatCardNumber(e) {
    setTimeout(() => {
      let value = CreditCard.replaceFullWidthChars(this.target.value);
      value = CreditCard.formatCardNumber(value);
      if (this.target === document.activeElement) {
        this.target.selectionStart = this.target.selectionEnd = CreditCard.safeVal(value, this.target);
      }
    });
  }

}
