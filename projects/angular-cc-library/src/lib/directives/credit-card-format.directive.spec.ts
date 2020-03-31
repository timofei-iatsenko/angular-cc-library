import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CreditCardFormatDirective } from './credit-card-format.directive';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

const KEY_MAP = {
  ONE: 49, // input `1`
  BACKSPACE: 8,
};

function createKeyEvent(keyCode: number) {
  return {keyCode, which: keyCode, preventDefault: jest.fn()};
}

function triggerKeyEvent(input: DebugElement, eventName: string, keyCode: number) {
  input.triggerEventHandler(eventName, createKeyEvent(keyCode));
}


describe('Directive: CreditCardFormat', () => {

  describe('general cases', () => {
    @Component({
      template: `<input type="tel" ccNumber>`,
    })
    class TestCreditCardFormatComponent {}

    let fixture: ComponentFixture<TestCreditCardFormatComponent>;
    let inputEl: DebugElement;
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestCreditCardFormatComponent, CreditCardFormatDirective],
      });
      fixture = TestBed.createComponent(TestCreditCardFormatComponent);
      inputEl = fixture.debugElement.query(By.css('input'));
    });

    it('formats card number tick by tick', fakeAsync(() => {

      inputEl.nativeElement.value = '4111 1111';
      triggerKeyEvent(inputEl, 'keydown', KEY_MAP.ONE);

      fixture.detectChanges();
      tick(10);
      expect(inputEl.nativeElement.value).toBe('4111 1111');

      triggerKeyEvent(inputEl, 'keypress', KEY_MAP.ONE);
      fixture.detectChanges();
      tick(10);
      expect(inputEl.nativeElement.value).toBe('4111 1111');

      // the value is changed here by the browser as default behavior
      inputEl.nativeElement.value = '4111 11111';

      inputEl.nativeElement.focus();
      inputEl.triggerEventHandler('input', null);
      fixture.detectChanges();
      tick(10);
      expect(inputEl.nativeElement.value).toBe('4111 1111 1');
      triggerKeyEvent(inputEl, 'keyup', KEY_MAP.ONE);

      fixture.detectChanges();
      tick(10);
      expect(inputEl.nativeElement.value).toBe('4111 1111 1');
    }));

    it('formats card number one tick', fakeAsync(() => {

      inputEl.nativeElement.value = '4111 1111';
      inputEl.triggerEventHandler('keydown', {keyCode: KEY_MAP.ONE, which: KEY_MAP.ONE});
      fixture.detectChanges();
      expect(inputEl.nativeElement.value).toBe('4111 1111');

      inputEl.triggerEventHandler('keypress', {keyCode: KEY_MAP.ONE, which: KEY_MAP.ONE});
      fixture.detectChanges();
      expect(inputEl.nativeElement.value).toBe('4111 1111');

      // the value is changed here by the browser as default behavior
      inputEl.nativeElement.value = '4111 11111';

      inputEl.triggerEventHandler('input', null);
      fixture.detectChanges();
      expect(inputEl.nativeElement.value).toBe('4111 1111 1');
    }));

    it('deletes from middle of value', fakeAsync(() => {

      inputEl.nativeElement.value = '4111 1111 111';
      inputEl.nativeElement.selectionStart = 5;
      inputEl.nativeElement.selectionEnd = 5;
      inputEl.nativeElement.focus();

      const event = createKeyEvent(KEY_MAP.BACKSPACE);

      inputEl.triggerEventHandler('keydown', event);
      fixture.detectChanges();
      tick(10);
      expect(inputEl.nativeElement.value).toBe('4111 1111 11');
      expect(inputEl.nativeElement.selectionStart).toBe(3);
      expect(inputEl.nativeElement.selectionEnd).toBe(3);
      expect(event.preventDefault).toBeCalled();

    }));

    it('deletes from beginning of value', fakeAsync(() => {

      inputEl.nativeElement.value = '5 411 1111';
      inputEl.nativeElement.selectionStart = 2;
      inputEl.nativeElement.selectionEnd = 2;
      inputEl.nativeElement.focus();

      const event = createKeyEvent(KEY_MAP.BACKSPACE);

      inputEl.triggerEventHandler('keydown', event);
      fixture.detectChanges();
      tick(10);
      expect(inputEl.nativeElement.value).toBe('4111 111');
      expect(inputEl.nativeElement.selectionStart).toBe(0);
      expect(inputEl.nativeElement.selectionEnd).toBe(0);
      expect(event.preventDefault).toBeCalled();

    }));

    it('does not modify deleting from end of value', fakeAsync(() => {

      inputEl.nativeElement.value = '4111 1111 111';
      inputEl.nativeElement.selectionStart = 13;
      inputEl.nativeElement.selectionEnd = 13;
      inputEl.nativeElement.focus();

      const event = createKeyEvent(KEY_MAP.BACKSPACE);
      inputEl.triggerEventHandler('keydown', event);
      fixture.detectChanges();
      tick(10);
      expect(inputEl.nativeElement.value).toBe('4111 1111 111');
      expect(inputEl.nativeElement.selectionStart).toBe(13);
      expect(inputEl.nativeElement.selectionEnd).toBe(13);
      expect(event.preventDefault).not.toBeCalled();

    }));
  });

  describe('exportAs cases', () => {
    @Component({
      template: `<input type="tel" ccNumber #ccNumber="ccNumber">
      <span class="scheme">{{ccNumber.resolvedScheme$ | async}}</span>`,
    })
    class TestCreditCardFormatComponent {}

    let fixture: ComponentFixture<TestCreditCardFormatComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestCreditCardFormatComponent, CreditCardFormatDirective],
      });
      fixture = TestBed.createComponent(TestCreditCardFormatComponent);
      inputEl = fixture.debugElement.query(By.css('input'));
    });

    it('should provide resolved scheme via exportAs', () => {
      (inputEl.nativeElement as HTMLInputElement).value = '4111111111111111';
      inputEl.triggerEventHandler('input', null);
      fixture.detectChanges();

      const span: HTMLSpanElement = fixture.debugElement.query(By.css('.scheme')).nativeElement;
      expect(span.textContent).toBe('visa');
    });
  });
});
