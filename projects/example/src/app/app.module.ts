import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { CreditCardDirectivesModule } from 'angular-cc-library';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CreditCardDirectivesModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
