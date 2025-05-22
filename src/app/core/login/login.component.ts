import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { LoginService } from "./login.service";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';



@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [LoginService]
})
export class LoginComponent {
  readonly hidePassword = signal(true);


  readonly #loginService = inject(LoginService);
  readonly #matSnackBar = inject(MatSnackBar);


  // new Date(1750547878 * 1000) (jwt.ext * 1000)

  readonly loginForm = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  })

  togglePassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.preventDefault();
  }

  submitForm() {
    const formValue = this.loginForm.value
    if (formValue?.email && formValue?.password) {
      this.#loginService.login(formValue).subscribe(
        (data: any) => console.log('success', data),
        (error: any) => this.#matSnackBar.open('Auth Error', 'Close', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'right' })
      );
    }
  }

}
