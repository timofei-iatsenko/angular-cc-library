import { NgModule } from '@angular/core';

import { CreditCardFormatDirective } from './directives/credit-card-format.directive';
import { ExpirayFormatDirective } from './directives/expiry-format.directive';


const CUSTOM_FORM_DIRECTIVES = [
  CreditCardFormatDirective,
  ExpirayFormatDirective
];

@NgModule({
  declarations: [CUSTOM_FORM_DIRECTIVES],
  exports: [CUSTOM_FORM_DIRECTIVES]
})
export class CustomFormsModule {
}
