import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { CreditCard } from './credit-card';

export class CreditCardValidators {
  public static validateCCNumber(control: AbstractControl): ValidationErrors | null {
    if (Validators.required(control) !== undefined && Validators.required(control) !== null) {
      return {ccNumber: true};
    }

    const num = control.value.toString().replace(/\s+|-/g, '');

    if (!/^\d+$/.test(num)) {
      return {ccNumber: true};
    }

    const card = CreditCard.cardFromNumber(num);

    if (!card) {
      return {ccNumber: true};
    }

    if (card.length.includes(num.length) && (card.luhn === false || CreditCard.luhnCheck(num))) {
      return null;
    }

    const upperlength = card.length[card.length.length - 1];
    if (num.length > upperlength) {
      const registeredNum = num.substring(0, upperlength);
      if (CreditCard.luhnCheck(registeredNum)) {
        return null;
      }
    }

    return {ccNumber: true};
  }

  public static validateExpDate(control: AbstractControl): ValidationErrors | null {
    if (Validators.required(control) !== undefined && Validators.required(control) !== null) {
      return {expDate: true};
    }

    if (typeof control.value !== 'undefined' && control.value.length >= 5) {
      let [month, year] = control.value.split(/[\s\/]+/, 2);

      if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
        const prefix = new Date().getFullYear().toString().slice(0, 2);
        year = prefix + year;
      }

      month = parseInt(month, 10).toString();
      year = parseInt(year, 10).toString();

      if (/^\d+$/.test(month) && /^\d+$/.test(year) && (month >= 1 && month <= 12)) {
        const expiry = new Date(year, month);
        const currentTime = new Date();
        expiry.setMonth(expiry.getMonth() - 1);
        expiry.setMonth(expiry.getMonth() + 1, 1);

        if (expiry > currentTime) {
          return null;
        }
      }
    }

    return {expDate: true};
  }
}

