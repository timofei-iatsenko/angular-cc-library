# Description

Angular CC Library - for validation and formating of input parameters

# Demo
1. Clone repo
2. run `yarn install`
3. run `yarn run:demo`
4. visit `http://localhost:4200`

# Usage

## Installation
```shell
npm install angular-cc-library --save
```

## Formatting Directive
On the input fields, add the specific directive to format inputs. 
All fields must be `type='tel'` in order to support spacing and additional characters

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CreditCardDirectivesModule } from 'angular-cc-library';

import { AppComponent } from './app.component';

@NgModule({
    imports: [BrowserModule, FormsModule, CreditCardDirectivesModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```

**Credit Card Formatter**
* add `ccNumber` directive:
```html
<input id="cc-number" type="tel" autocomplete="cc-number" ccNumber>
```
* this will also apply a class name based off the card `.visa`, `.amex`, etc. See the array of card types in `credit-card.ts` for all available types

* You can get parsed card type by using export api: 

```html
<input type="tel" ccNumber #ccNumber="ccNumber">
<span class="scheme">{{ccNumber.resolvedScheme$ | async}}</span>
```

`resolvedScheme$` will be populated with `visa`, `amex`, etc.


**Expiration Date Formatter**
Will support format of MM/YY or MM/YYYY
* add `ccExp` directive:
```html
<input id="cc-exp-date" type="tel" autocomplete="cc-exp" ccExp>
```

**CVC Formater**
* add `ccCvc` directive:
```html
<input id="cc-cvc" type="tel" autocomplete="off" ccCVC>
```

### Validation
Current only Model Validation is supported.
To implement, import the validator library and apply the specific validator on each form control

```typescript
import { CreditCardValidators } from 'angular-cc-library';

@Component({
  selector: 'app',
  template: `
    <form #demoForm="ngForm" (ngSubmit)="onSubmit(demoForm)" novalidate>
        <input id="cc-number" formControlName="creditCard" type="tel" autocomplete="cc-number" ccNumber>
        <input id="cc-exp-date" formControlName="expirationDate" type="tel" autocomplete="cc-exp" ccExp>
        <input id="cc-cvc" formControlName="cvc" type="tel" autocomplete="off" ccCvc>
    </form>
  `
})
export class AppComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.form = this._fb.group({
      creditCard: ['', [CreditCardValidators.validateCCNumber]],
      expirationDate: ['', [CreditCardValidators.validateExpDate]],
      cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]] 
    });
  }

  onSubmit(form) {
    this.submitted = true;
    console.log(form);
  }
}
```

# Inspiration

Based on Stripe's [jquery.payment](https://github.com/stripe/jquery.payment) plugin but adapted for use by Angular

# License

MIT
