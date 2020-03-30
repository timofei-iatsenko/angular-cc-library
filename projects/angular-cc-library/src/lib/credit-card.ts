const defaultFormat = /(\d{1,4})/g;

export interface CardDefinition {
  type: string;
  patterns: number[];
  format: RegExp;
  length: number[];
  cvvLength: number[];
  luhn: boolean;
}

const cards: CardDefinition[] = [
  {
    type: 'maestro',
    patterns: [5018, 502, 503, 506, 56, 58, 639, 6220, 67],
    format: defaultFormat,
    length: [12, 13, 14, 15, 16, 17, 18, 19],
    cvvLength: [3],
    luhn: true,
  }, {
    type: 'forbrugsforeningen',
    patterns: [600],
    format: defaultFormat,
    length: [16],
    cvvLength: [3],
    luhn: true,
  }, {
    type: 'dankort',
    patterns: [5019],
    format: defaultFormat,
    length: [16],
    cvvLength: [3],
    luhn: true,
  }, {
    type: 'visa',
    patterns: [4],
    format: defaultFormat,
    length: [13, 16, 19],
    cvvLength: [3],
    luhn: true,
  }, {
    type: 'mastercard',
    patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27],
    format: defaultFormat,
    length: [16],
    cvvLength: [3],
    luhn: true,
  }, {
    type: 'amex',
    patterns: [34, 37],
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    length: [15],
    cvvLength: [3, 4],
    luhn: true,
  }, {
    type: 'dinersclub',
    patterns: [30, 36, 38, 39],
    format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
    length: [14],
    cvvLength: [3],
    luhn: true,
  }, {
    type: 'discover',
    patterns: [60, 64, 65, 622],
    format: defaultFormat,
    length: [16],
    cvvLength: [3],
    luhn: true,
  }, {
    type: 'unionpay',
    patterns: [62, 88],
    format: defaultFormat,
    length: [16, 17, 18, 19],
    cvvLength: [3],
    luhn: false,
  }, {
    type: 'jcb',
    patterns: [35],
    format: defaultFormat,
    length: [16, 19],
    cvvLength: [3],
    luhn: true,
  },
];

// @dynamic
export class CreditCard {

  public static cards() {
    return cards;
  }

  public static cardFromNumber(num: string): CardDefinition {
    num = (num + '').replace(/\D/g, '');

    for (let i = 0, len = cards.length; i < len; i++) {
      const card = cards[i];
      const ref = card.patterns;

      for (let j = 0, len1 = ref.length; j < len1; j++) {
        const pattern = ref[j];
        const p = pattern + '';

        if (num.substr(0, p.length) === p) {
          return card;
        }
      }
    }
  }

  public static restrictNumeric(e: KeyboardEvent): boolean {
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    const input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }

  public static hasTextSelected(target: HTMLInputElement) {
    return target.selectionStart !== null && target.selectionStart !== target.selectionEnd;
  }

  public static cardType(num: string) {
    if (!num) {
      return num;
    }

    const card = this.cardFromNumber(num);

    if (card !== null && typeof card !== 'undefined') {
      return card.type;
    } else {
      return null;
    }
  }

  public static formatCardNumber(num: string) {
    num = num.replace(/\D/g, '');
    const card = this.cardFromNumber(num);

    if (!card) {
      return num;
    }

    const upperLength = card.length[card.length.length - 1];
    num = num.slice(0, upperLength);

    if (card.format.global) {
      const matches = num.match(card.format);
      if (matches != null) {
        return matches.join(' ');
      }
    } else {
      const groups = card.format.exec(num);
      if (groups == null) {
        return;
      }
      groups.shift();
      return groups.filter(Boolean).join(' ');
    }
  }

  public static safeVal(value: string, target: HTMLInputElement, updateValue: (value: string) => void): number {
    let cursor: number | null = null;
    const last = target.value;
    let result: number = null;

    try {
      cursor = target.selectionStart;
    } catch (error) {}

    updateValue(value);

    if (cursor !== null && target === document.activeElement) {
      if (cursor === last.length) {
        cursor = value.length;
      }

      if (last !== value) {
        const prevPair = last.slice(cursor - 1, +cursor + 1 || 9e9);
        const currPair = value.slice(cursor - 1, +cursor + 1 || 9e9);
        const digit = value[cursor];

        if (/\d/.test(digit) && prevPair === (`${digit} `) && currPair === (` ${digit}`)) {
          cursor = cursor + 1;
        }
      }

      result = cursor;
    }
    return result;
  }

  public static isCardNumber(key: number, target: HTMLInputElement): boolean {
    const digit = String.fromCharCode(key);
    if (!/^\d+$/.test(digit)) {
      return false;
    }
    if (CreditCard.hasTextSelected(target)) {
      return true;
    }
    const value = (target.value + digit).replace(/\D/g, '');
    const card = CreditCard.cardFromNumber(value);

    if (card) {
      return value.length <= card.length[card.length.length - 1];
    } else {
      return value.length <= 16;
    }
  }

  public static restrictExpiry(key: number, target: HTMLInputElement) {
    const digit = String.fromCharCode(key);
    if (!/^\d+$/.test(digit) || this.hasTextSelected(target)) {
      return false;
    }
    const value = `${target.value}${digit}`.replace(/\D/g, '');

    return value.length > 6;
  }

  public static replaceFullWidthChars(str: string) {
    if (str === null) {
      str = '';
    }

    const fullWidth = '\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19';
    const halfWidth = '0123456789';
    let value = '';
    const chars = str.split('');

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < chars.length; i++) {
      let chr = chars[i];
      const idx = fullWidth.indexOf(chr);
      if (idx > -1) {
        chr = halfWidth[idx];
      }
      value += chr;
    }
    return value;
  }

  public static formatExpiry(expiry: string) {
    const parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/);

    if (!parts) {
      return '';
    }

    let mon  = parts[1] || '';
    let sep  = parts[2] || '';
    const year = parts[3] || '';

    if (year.length > 0) {
      sep = ' / ';
    } else if (sep === ' /') {
      mon = mon.substring(0, 1);
      sep = '';
    } else if (mon.length === 2 || sep.length > 0) {
      sep = ' / ';
    } else if (mon.length === 1 && (mon !== '0' && mon !== '1')) {
      mon = `0${mon}`;
      sep = ' / ';
    }
    return `${mon}${sep}${year}`;
  }

  public static restrictCvc(key: number, target: HTMLInputElement) {
    const digit = String.fromCharCode(key);
    if (!/^\d+$/.test(digit) || this.hasTextSelected(target)) {
      return false;
    }
    const val = `${target.value}${digit}`;
    return val.length <= 4;
  }

  public static luhnCheck(num: string) {
    const digits = num.split('').reverse();
    let odd = true;
    let sum = 0;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < digits.length; i++) {
      let digit = parseInt(digits[i], 10);
      // tslint:disable-next-line:no-conditional-assignment
      if ((odd = !odd)) {
        digit *= 2;
      }
      if (digit > 9) {
        digit -= 9;
      }
      sum += digit;
    }

    return sum % 10 === 0;
  }
}
