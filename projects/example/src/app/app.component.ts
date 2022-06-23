import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { CreditCardValidators, CreditCard } from 'angular-cc-library';
import { defer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public demoForm: UntypedFormGroup;
  public submitted = false;

  public type$ = defer(() => this.demoForm.get('creditCard').valueChanges)
    .pipe(map((num: string) => CreditCard.cardType(num)));

  constructor(private fb: UntypedFormBuilder) {}

  public ngOnInit() {
    this.demoForm = this.fb.group({
      creditCard: ['', [CreditCardValidators.validateCCNumber]],
      expDate: ['', [CreditCardValidators.validateExpDate]],
      cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
    });
  }

  public goToNextField(controlName: string, nextField: HTMLInputElement) {
    if (this.demoForm.get(controlName)?.valid) {
      nextField.focus();
    }
  }

  public onSubmit(demoForm: UntypedFormGroup) {
    this.submitted = true;
    console.log(demoForm.value);
  }
}
