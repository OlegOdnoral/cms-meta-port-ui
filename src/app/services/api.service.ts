import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);
  jwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsImlhdCI6MTcyNTAyODkyOCwiZXhwIjoxNzI3NjIwOTI4fQ._7wIN3ZSsu52dhn7XdbWGxApouOaOJLLDXjQV1I40Uw';
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.jwt}`,
    'content-type': 'application/json',
  });

  getConfigs() {
    return this.http.get('http://localhost:1337/api/partner-configs');
  }

  createConfig(data: {
    address: string;
    header_img: string;
    partner_id: string;
    is_active: boolean;
    budget: string;
    color_schemas: string;
    avatar: string;
  }): Observable<any> {
    return this.http.post('http://localhost:1337/api/partner-configs', {
      data,
    });
  }

  deleteConfig(id: string) {
    return this.http.delete(`http://localhost:1337/api/partner-configs/${id}`);
  }

  registerUser(data: {
    firstname: string;
    email: string;
    lastname: string;
    roles: string[];
  }): Observable<any> {
    return this.http.post('http://localhost:1337/admin/users', data, {
      headers: this.headers,
    });
  }

  login(data: { identifier: string; password: string }): Observable<any> {
    return this.http.post<any>('http://localhost:1337/api/auth/local', data);
  }

  getUsers(): Observable<any> {
    // return this.http.get('http://localhost:1337/api/users');
    return this.http.get(
      'http://localhost:1337/admin/users/?pageSize=10&page=1&sort=firstname',
      { headers: this.headers }
    );
  }

  getRoles(): Observable<any> {
    return this.http.get('http://localhost:1337/admin/roles', {
      headers: this.headers,
    });
  }

  deleteUser(id: string) {
    const data = { id: +id };
    return this.http.request(
      'delete',
      `http://localhost:1337/admin/users/batch-delete`,
      { body: data, headers: this.headers }
    );
  }
}
