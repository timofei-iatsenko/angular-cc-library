import { CreditCard } from '../shared/credit-card';

describe('Shared: Credit Card', () => {

  beforeEach(() => {
  });

  it('should return a card object by number', () => {
    let number = '4111111111111111';

    expect(CreditCard.cardFromNumber(number)).toEqual({
      type: 'visa',
      patterns: [4],
      format: /(\d{1,4})/g,
      length: [13, 16],
      cvvLength: [3],
      luhn: true
    });
  });

  it('should restrict numeric', () => {
    let valid = {
      which: 49 // key press 1
    };
    let metaKey = {
      metaKey: true
    };
    let invalid = {
      which: 32
    };
    expect(CreditCard.restrictNumeric(valid)).toBe(true);
    expect(CreditCard.restrictNumeric(metaKey)).toBe(true);
    expect(CreditCard.restrictNumeric(invalid)).toBe(false);
  });

  it('should determine text selected', () => {
    let target = {
      selectionStart: 1,
      selectionEnd: 2
    };
    expect(CreditCard.hasTextSelected(target)).toBe(true);

    target.selectionStart = null;
    expect(CreditCard.hasTextSelected(target)).toBe(false);

    target.selectionStart = 1;
    target.selectionEnd   = 1;
    expect(CreditCard.hasTextSelected(target)).toBe(false);
  });

  it('should return card type', () => {
    expect(CreditCard.cardType(false)).toBe(false);

    let num = '4111111111111111';

    expect(CreditCard.cardType(num)).toBe('visa');
  });

  it('should format a card number', () => {
    let number = '4111111111111111';

    expect(CreditCard.formatCardNumber(number)).toBe('4111 1111 1111 1111');
  });

  it('should return a safe value', () => {
    let value = '';
    let target: any = {
      selectionStart: 1,
      selectionEnd: 2
    };

    expect(CreditCard.safeVal(value, target)).toBe(false);


    let element = document.createElement('input');
    document.body.appendChild(element);
    element.focus();

    target = element;
    target.selectionStart = 1;
    target.value = '4111111111111111';

    expect(CreditCard.safeVal(target.value, target)).toBe(16);

  });

  it('should restrict card number', () => {
    let key = 49;
    let target = {
      selectionStart: null,
      value: '411111111111111'
    };

    expect(CreditCard.isCardNumber(key, target)).toBe(true);

    target.value = '41111111111111111';
    expect(CreditCard.isCardNumber(key, target)).toBe(false);

  });

  it('should restrict expiry', () => {
    let key = 1;
    let target = {
      selectionStart: null,
      value: '12 / 12'
    };

    expect(CreditCard.restrictExpiry(key, target)).toBe(false);

    key = 49;
    expect(CreditCard.restrictExpiry(key, target)).toBe(false);

    target.value = '12 / 1234';
    expect(CreditCard.restrictExpiry(key, target)).toBe(true);

  });

  it('should replace full width characters', () => {
    expect(CreditCard.replaceFullWidthChars(null)).toBe('');

    let str = '０１２３４５６７８９';
    expect(CreditCard.replaceFullWidthChars(str)).toBe('0123456789');
  });

  it('should format expiration date', () => {
    expect(CreditCard.formatExpiry('1234')).toBe('12 / 34');

    expect(CreditCard.formatExpiry('123456')).toBe('12 / 3456');
  });

  it('should restrict CVV', () => {
    let key = 1;
    let target = {
      selectionStart: null,
      value: '123'
    };

    expect(CreditCard.restrictCvc(key, target)).toBe(false);

    key = 49;
    expect(CreditCard.restrictCvc(key, target)).toBe(true);

    target.value = '1234';
    expect(CreditCard.restrictCvc(key, target)).toBe(false);

  });

  it('should check for luhn value', () => {
    expect(CreditCard.luhnCheck('4111111111111111')).toBe(true);

    expect(CreditCard.luhnCheck('4511111111111111')).toBe(false);
  });
});

