import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  emitData = output<any>();

  loginForm = new FormGroup({
    identifier: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  onSubmit() {
    this.emitData.emit(this.loginForm.value);
    this.loginForm.reset();
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe();
  }
}
