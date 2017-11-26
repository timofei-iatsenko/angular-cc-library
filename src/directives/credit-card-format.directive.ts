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
        re,
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

    if ((this.target.selectionStart != null) && this.target.selectionStart !== value.length) {
      // return;
    }

    if (card && card.type === 'amex') {
      re = /^(\d{4}|\d{4}\s\d{6})$/;
    } else {
      re = /(?:^|\s)(\d{4})$/;
    }

    if (re.test(value)) {
      setTimeout(() => {
        this.target.value = `${value} ${digit}`;
      });
    } else if (re.test(value + digit)) {
      setTimeout(() => {
        this.target.value = `${value}${digit} `;
      });
    }
  }

  private formatBackCardNumber(e) {
    let value = this.target.value;

    if (e.which !== 8) {
      return;
    }

    if ((this.target.selectionStart != null) && this.target.selectionStart !== value.length) {
      // return;
    }

    if (/\d\s$/.test(value)) {
      e.preventDefault();
      setTimeout(() => {
        this.target.value = value.replace(/\d\s$/, '');
      });
    } else if (/\s\d?$/.test(value)) {
      e.preventDefault();
      setTimeout(() => {
        this.target.value = value.replace(/\d$/, '');
      });
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
      this.target.selectionStart = this.target.selectionEnd = CreditCard.safeVal(value, this.target);
    });
  }

}
