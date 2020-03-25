import { CreditCard } from './credit-card';

describe('Shared: Credit Card', () => {
  it('should return a card object by number', () => {
    const num = '4111111111111111';

    expect(CreditCard.cardFromNumber(num)).toEqual({
      type: 'visa',
      patterns: [4],
      format: /(\d{1,4})/g,
      length: [13, 16, 19],
      cvvLength: [3],
      luhn: true,
    });
  });

  it('should restrict numeric', () => {

    const valid: Partial<KeyboardEvent> = {
      which: 49, // key press 1
    };
    const metaKey: Partial<KeyboardEvent> = {
      metaKey: true,
    };
    const invalid: Partial<KeyboardEvent> = {
      which: 32,
    };
    expect(CreditCard.restrictNumeric(valid as KeyboardEvent)).toBe(true);
    expect(CreditCard.restrictNumeric(metaKey as KeyboardEvent)).toBe(true);
    expect(CreditCard.restrictNumeric(invalid as KeyboardEvent)).toBe(false);
  });

  it('should determine text selected', () => {
    const target: Partial<HTMLInputElement> = {
      selectionStart: 1,
      selectionEnd: 2,
    };
    expect(CreditCard.hasTextSelected(target as HTMLInputElement)).toBe(true);

    target.selectionStart = null;
    expect(CreditCard.hasTextSelected(target as HTMLInputElement)).toBe(false);

    target.selectionStart = 1;
    target.selectionEnd   = 1;
    expect(CreditCard.hasTextSelected(target as HTMLInputElement)).toBe(false);
  });

  it('should return card type', () => {
    expect(CreditCard.cardType(null)).toBeFalsy();

    const num = '4111111111111111';
    expect(CreditCard.cardType(num)).toBe('visa');
  });

  it('should format a card number', () => {
    const num = '4111111111111111';
    expect(CreditCard.formatCardNumber(num)).toBe('4111 1111 1111 1111');
  });

  xit('should return a safe value', () => {
    const value = '';
    let target: Partial<HTMLInputElement> = {
      selectionStart: 1,
      selectionEnd: 2,
    };

    expect(CreditCard.safeVal(value, target as HTMLInputElement, (val) => target.value = val)).toBe(null);

    const element = document.createElement('input');
    document.body.appendChild(element);
    element.focus();

    target = element;
    target.selectionStart = 1;
    target.value = '4111111111111111';

    expect(CreditCard.safeVal(target.value, target as HTMLInputElement, (val) => target.value = val)).toBe(16);

  });

  it('should restrict card number', () => {
    const key = 49;
    const target: Partial<HTMLInputElement> = {
      selectionStart: null,
      value: '411111111111111',
    };

    expect(CreditCard.isCardNumber(key, target as HTMLInputElement)).toBe(true);

    target.value = '41111111111111111111';
    expect(CreditCard.isCardNumber(key, target as HTMLInputElement)).toBe(false);

  });

  it('should restrict expiry', () => {
    let key = 1;
    const target: Partial<HTMLInputElement> = {
      selectionStart: null,
      value: '12 / 12',
    };

    expect(CreditCard.restrictExpiry(key, target as HTMLInputElement)).toBe(false);

    key = 49;
    expect(CreditCard.restrictExpiry(key, target as HTMLInputElement)).toBe(false);

    target.value = '12 / 1234';
    expect(CreditCard.restrictExpiry(key, target as HTMLInputElement)).toBe(true);

  });

  it('should replace full width characters', () => {
    expect(CreditCard.replaceFullWidthChars(null)).toBe('');

    const str = '０１２３４５６７８９';
    expect(CreditCard.replaceFullWidthChars(str)).toBe('0123456789');
  });

  it('should format expiration date', () => {
    expect(CreditCard.formatExpiry('1234')).toBe('12 / 34');

    expect(CreditCard.formatExpiry('123456')).toBe('12 / 3456');
  });

  it('should restrict CVV', () => {
    let key = 1;
    const target: Partial<HTMLInputElement> = {
      selectionStart: null,
      value: '123',
    };

    expect(CreditCard.restrictCvc(key, target as HTMLInputElement)).toBe(false);

    key = 49;
    expect(CreditCard.restrictCvc(key, target as HTMLInputElement)).toBe(true);

    target.value = '1234';
    expect(CreditCard.restrictCvc(key, target as HTMLInputElement)).toBe(false);

  });

  it('should check for luhn value', () => {
    expect(CreditCard.luhnCheck('4111111111111111')).toBe(true);

    expect(CreditCard.luhnCheck('4511111111111111')).toBe(false);
  });
});
