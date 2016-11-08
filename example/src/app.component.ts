import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { CreditCardValidator } from '../../src/shared/credit-card.validator';

@Component({
  selector: 'app',
  template: require('./app.html')
})
export class AppComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.form = this._fb.group({
      creditCard: ['', [<any>CreditCardValidator.validateCCNumber]],
      expirationDate: ['', [<any>CreditCardValidator.validateExp]],
      cvc: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]] // TODO compare actual results against card type
    });
  }

  onSubmit(form) {
    this.submitted = true;
    console.log(form);
  }
}
