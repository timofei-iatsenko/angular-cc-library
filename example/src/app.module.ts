import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CreditCardFormatDirective } from '../../src/directives/credit-card-format.directive';

import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, FormsModule],
  declarations: [
    AppComponent,
    CreditCardFormatDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
