import { NgModule } from '@angular/core';

import { CreditCardFormatDirective } from './directives/credit-card-format.directive';
import { ExpirayFormatDirective } from './directives/expiry-format.directive';
import { CvcFormatDirective } from './directives/cvc-format.directive';

const CREDIT_CARD_LIBRARY_DIRECTIVES = [
  CreditCardFormatDirective,
  ExpirayFormatDirective,
  CvcFormatDirective
];

@NgModule({
  declarations: [CREDIT_CARD_LIBRARY_DIRECTIVES],
  exports: [CREDIT_CARD_LIBRARY_DIRECTIVES]
})
export class CreditCardDirectivesModule {
}
