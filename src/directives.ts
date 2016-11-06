import { NgModule } from '@angular/core';

import { CreditCardDirective } from './directives/credit-card.directive';


const CUSTOM_FORM_DIRECTIVES = [
  CreditCardDirective,
];

@NgModule({
  declarations: [CUSTOM_FORM_DIRECTIVES],
  exports: [CUSTOM_FORM_DIRECTIVES]
})
export class CustomFormsModule {
}
