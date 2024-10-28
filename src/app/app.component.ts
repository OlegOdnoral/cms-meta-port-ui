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
import { switchMap, take, tap } from 'rxjs';
import { DataService } from './services/data.service';
import { ConfigsSectionComponent } from './components/configs-section/configs-section.component';
import { AsyncPipe, NgForOf } from "@angular/common";

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
    AsyncPipe,
    NgForOf,
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

  fileToUpload: File | null = null;

  files = this.dataService.getFiles();

  registerUser(data: any) {
    return this.apiService
      .registerUser(data.formData)
      .pipe(
        tap((res) => {
          if (data.isRedirected) {
            this.urlToRedirect.set(
              `http://localhost:4201/admin/auth/register?registrationToken=${res.data.registrationToken}`
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

  loginAdminUser({ identifier, password }: { identifier: string; password: string }) {
    this.dataService.loginAdminUsers({ email: identifier, password }).subscribe();
  }

  addConfig(data: any) {
    this.dataService.addConfigs(data).subscribe();
  }

  getFiles() {
    this.dataService.getFiles().pipe(take(1)).subscribe((data: any) => console.log(data))
  }

  uploadFile($event: any) {
    this.fileToUpload = $event.target?.files.item(0);
    console.log(this.fileToUpload)
    this.dataService.uploadFile({
      files: this.fileToUpload,
      ref: 'api::partner-config.partner-config',
      refId: '12',
      field: 'pertner_logo'
    }).pipe(take(1)).subscribe(() => this.getFiles())
  }

  deleteFile(id: string) {
    this.dataService.deleteFile(id)
      .pipe(take(1))
      .subscribe(() => this.files = this.dataService.getFiles())
  }

  updateFile($event: any) {
    this.fileToUpload = $event.target?.files.item(0) as File;
    this.dataService.updateFile({
      files: this.fileToUpload
    }).pipe(take(1)).subscribe(() => this.files = this.dataService.getFiles())
  }

  updateFileById($event: any, id: string) {
    this.fileToUpload = $event.target?.files.item(0) as File;
    this.dataService.updateFile({
      files: this.fileToUpload
    }, id).pipe(take(1)).subscribe(() => this.files = this.dataService.getFiles())
  }

  ngOnInit(): void {
    this.dataService.getUsers();
    this.dataService.getRoles();
    this.getFiles();
  }
}
