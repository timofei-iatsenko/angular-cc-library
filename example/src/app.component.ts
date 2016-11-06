import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app',
  template: require('./app.html')
})
export class AppComponent implements OnInit {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.form = this._fb.group({
      creditCard: ['', [<any>Validators.required]],
      expirationDate: ['', [<any>Validators.required]]
    });
  }

  onSubmit(form) {
    console.log(form);
  }
}
