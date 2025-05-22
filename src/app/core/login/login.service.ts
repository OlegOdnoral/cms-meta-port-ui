import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

export interface LoginForm {
  email: string;
  password: string;
}

@Injectable()
export class LoginService {
  readonly #http = inject(HttpClient);

  login(data: Partial<LoginForm>): any  {
    return this.#http.post('http://localhost:4202/admin/login', data);
  }
}
