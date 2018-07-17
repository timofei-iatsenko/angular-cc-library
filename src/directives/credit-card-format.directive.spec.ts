import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import {CreditCardFormatDirective} from './credit-card-format.directive';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<input type="tel" ccNumber>`
})
class TestCreditCardFormatComponent {
}

describe('Directive: CreditCardFormat', () => {
  let component: TestCreditCardFormatComponent;
  let fixture: ComponentFixture<TestCreditCardFormatComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestCreditCardFormatComponent, CreditCardFormatDirective]
    });
    fixture = TestBed.createComponent(TestCreditCardFormatComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('formats card number tick by tick', fakeAsync(() => {

    inputEl.nativeElement.value = '4111 1111';
    inputEl.triggerEventHandler('keydown', {keyCode: 49, which: 49});
    fixture.detectChanges();
    tick(10);
    expect(inputEl.nativeElement.value).toBe('4111 1111');

    inputEl.triggerEventHandler('keypress', {keyCode: 49, which: 49});
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

    inputEl.triggerEventHandler('keyup', {keyCode: 49, which: 49});
    fixture.detectChanges();
    tick(10);
    expect(inputEl.nativeElement.value).toBe('4111 1111 1');

  }));

  it('formats card number one tick', fakeAsync(() => {

    inputEl.nativeElement.value = '4111 1111';
    inputEl.triggerEventHandler('keydown', {keyCode: 49, which: 49});
    fixture.detectChanges();
    expect(inputEl.nativeElement.value).toBe('4111 1111');

    inputEl.triggerEventHandler('keypress', {keyCode: 49, which: 49});
    fixture.detectChanges();
    expect(inputEl.nativeElement.value).toBe('4111 1111');

    // the value is changed here by the browser as default behavior
    inputEl.nativeElement.value = '4111 11111';

    inputEl.triggerEventHandler('input', null);
    fixture.detectChanges();
    expect(inputEl.nativeElement.value).toBe('4111 11111');

    inputEl.nativeElement.focus();
    inputEl.triggerEventHandler('keyup', {keyCode: 49, which: 49});
    fixture.detectChanges();
    expect(inputEl.nativeElement.value).toBe('4111 11111');

    tick(10);
    expect(inputEl.nativeElement.value).toBe('4111 1111 1');

  }));

  it('deletes from middle of value', fakeAsync(() => {

    inputEl.nativeElement.value = '4111 1111 111';
    inputEl.nativeElement.selectionStart = 5;
    inputEl.nativeElement.selectionEnd = 5;
    inputEl.nativeElement.focus();

    let defPrevented = false;

    inputEl.triggerEventHandler('keydown', {keyCode: 8, which: 8, preventDefault: function() { defPrevented = true; }});
    fixture.detectChanges();
    tick(10);
    expect(inputEl.nativeElement.value).toBe('4111 1111 11');
    expect(inputEl.nativeElement.selectionStart).toBe(3);
    expect(inputEl.nativeElement.selectionEnd).toBe(3);
    expect(defPrevented).toBeTruthy();

  }));

  it('deletes from beginning of value', fakeAsync(() => {

    inputEl.nativeElement.value = '5 411 1111';
    inputEl.nativeElement.selectionStart = 2;
    inputEl.nativeElement.selectionEnd = 2;
    inputEl.nativeElement.focus();

    let defPrevented = false;

    inputEl.triggerEventHandler('keydown', {keyCode: 8, which: 8, preventDefault: function() { defPrevented = true; }});
    fixture.detectChanges();
    tick(10);
    expect(inputEl.nativeElement.value).toBe('4111 111');
    expect(inputEl.nativeElement.selectionStart).toBe(0);
    expect(inputEl.nativeElement.selectionEnd).toBe(0);
    expect(defPrevented).toBeTruthy();

  }));

  it('does not modify deleting from end of value', fakeAsync(() => {

    inputEl.nativeElement.value = '4111 1111 111';
    inputEl.nativeElement.selectionStart = 13;
    inputEl.nativeElement.selectionEnd = 13;
    inputEl.nativeElement.focus();

    let defPrevented = false;

    inputEl.triggerEventHandler('keydown', {keyCode: 8, which: 8, preventDefault: function() { defPrevented = true; }});
    fixture.detectChanges();
    tick(10);
    expect(inputEl.nativeElement.value).toBe('4111 1111 111');
    expect(inputEl.nativeElement.selectionStart).toBe(13);
    expect(inputEl.nativeElement.selectionEnd).toBe(13);
    expect(defPrevented).toBeFalsy();

  }));
});
