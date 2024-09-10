import { map, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  ApiService = inject(ApiService);
  configs = signal<any>(null);
  users = signal<any>(null);
  roles = signal<any>(null);
  JWT = signal<any>('');

  getConfigs() {
    return this.ApiService.getConfigs().pipe(
      map((res: any) => this.configs.set(res.data))
    );
  }

  getUsers() {
    return this.ApiService.getUsers().subscribe((res) =>
      this.users.set(res.data.results)
    );
  }

  getRoles() {
    return this.ApiService.getRoles().subscribe((res) =>
      this.roles.set(res.data)
    );
  }

  refreshUsers() {
    return this.ApiService.getUsers().pipe(
      map((res: any) => this.users.set(res.data.results))
    );
  }

  loginUsers(data: any) {
    return this.ApiService.login(data).pipe(
      map((res) => this.JWT.set(res.jwt))
    );
  }

  registerUser(data: any) {
    return this.ApiService.registerUser(data);
  }

  addConfigs(data: any) {
    return this.ApiService.createConfig(data).pipe(
      switchMap(() => this.getConfigs())
    );
  }

  deleteConfig(id: string) {
    return this.ApiService.deleteConfig(id).pipe(
      switchMap(() => this.getConfigs())
    );
  }
}
