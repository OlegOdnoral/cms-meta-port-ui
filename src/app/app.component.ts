import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { ApiService } from './services/api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { AddconfigComponent } from './components/addconfig/addconfig.component';
import { UsersSectionComponent } from './components/users-section/users-section.component';
import { switchMap, tap } from 'rxjs';
import { DataService } from './services/data.service';
import { ConfigsSectionComponent } from './components/configs-section/configs-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RegistrationComponent,
    LoginComponent,
    AddconfigComponent,
    ConfigsSectionComponent,
    UsersSectionComponent,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ApiService, DataService],
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  title = 'testing-app';
  apiService = inject(ApiService);
  dataService = inject(DataService);
  urlToRedirect = signal<string>('');

  jwt: WritableSignal<any> = this.dataService.JWT;

  registerUser(data: any) {
    return this.apiService
      .registerUser(data.formData)
      .pipe(
        tap((res) => {
          if (data.isRedirected) {
            this.urlToRedirect.set(
              `http://localhost:1337/admin/auth/register?registrationToken=${res.data.registrationToken}`
            );
          }
        }),
        switchMap(() => {
          return this.dataService.refreshUsers();
        })
      )
      .subscribe(() =>
        data.isRedirected ? window.open(this.urlToRedirect(), '_blank') : null
      );
  }

  loginUser(data: any) {
    this.dataService.loginUsers(data).subscribe();
  }

  addConfig(data: any) {
    this.dataService.addConfigs(data).subscribe();
  }

  ngOnInit(): void {
    this.dataService.getUsers();
    this.dataService.getRoles();
  }
}
