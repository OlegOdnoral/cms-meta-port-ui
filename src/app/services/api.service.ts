import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);
  jwt =
    '82ea9c923f4c9704c457ab02bb5e00179ada733703325db5ad3a66097c01dea1765e90ddd4e78a2f81053c9617f28ec1d7e610471442c30e5a2d9bf89b4f4fcb91f35b445cb206f982c7ad6013e149283c966fb597acd0e182893daf298f165cd4577ec8c1a906354579addc98d3a1d1c2e94e27c4a99bdc3ac4080e55652d91';
  jwt2 = '82ea9c923f4c9704c457ab02bb5e00179ada733703325db5ad3a66097c01dea1765e90ddd4e78a2f81053c9617f28ec1d7e610471442c30e5a2d9bf89b4f4fcb91f35b445cb206f982c7ad6013e149283c966fb597acd0e182893daf298f165cd4577ec8c1a906354579addc98d3a1d1c2e94e27c4a99bdc3ac4080e55652d91';

  headers = new HttpHeaders({
    Authorization: `Bearer ${this.jwt}`,
    'content-type': 'application/json',
    'X-Auth-token': this.jwt2
  });

  constructor() {
    this.#updateToken()
    this.getConfigsC().subscribe();
  }

  #updateToken() {
    const token = localStorage.getItem('panel_jwt');
    console.log(token)
    if (token) {
      this.jwt = token;
      this.headers = new HttpHeaders({
        Authorization: `Bearer ${this.jwt}`,
        'content-type': 'application/json',
        'X-Auth-token': this.jwt2
      });
    }
  }

  getConfigs() {
    return this.http.get('http://localhost:4201/api/partner-configs');
  }

  getConfigsC() {
    // return this.http.get('http://localhost:4201/custom-api/cust_api_v1', {
    return this.http.get('http://localhost:4201/api/partner-by-user', {
      headers: this.headers,
    });
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
    return this.http.post('http://localhost:4201/api/partner-configs', {
      data,
    }, { headers: this.headers });
  }

  deleteConfig(id: string) {
    return this.http.delete(`http://localhost:4201/api/partner-configs/${id}`);
  }

  registerUser(data: {
    firstname: string;
    email: string;
    lastname: string;
    roles: string[];
  }): Observable<any> {
    return this.http.post('http://localhost:4201/admin/users', data, {
      headers: this.headers,
    });
  }

  loginAdmin(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>('http://localhost:4201/admin/login', data).pipe(map(res => res.data));
  }

  login(data: { identifier: string; password: string }): Observable<any> {
    return this.http.post<any>('http://localhost:4201/api/auth/local', data);
  }


  getUsers(): Observable<any> {
    // return this.http.get('http://localhost:4201/api/users');
    return this.http.get(
      'http://localhost:4201/admin/users/?pageSize=10&page=1&sort=firstname',
      { headers: this.headers }
    );
  }

  getRoles(): Observable<any> {
    return this.http.get('http://localhost:4201/admin/roles', {
      headers: this.headers,
    });
  }

  deleteUser(id: string) {
    const data = { id: +id };
    return this.http.request(
      'delete',
      `http://localhost:4201/admin/users/batch-delete`,
      { body: data, headers: this.headers }
    );
  }
}
