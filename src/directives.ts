import { NgModule } from '@angular/core';

import { CreditCardFormatDirective } from './directives/credit-card-format.directive';


const CUSTOM_FORM_DIRECTIVES = [
  CreditCardFormatDirective,
];

@NgModule({
  declarations: [CUSTOM_FORM_DIRECTIVES],
  exports: [CUSTOM_FORM_DIRECTIVES]
})
export class CustomFormsModule {
}
