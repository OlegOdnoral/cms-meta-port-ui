import { DataService } from './../../services/data.service';
import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { skip, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-users-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-section.component.html',
  styleUrl: './users-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersSectionComponent {
  apiService = inject(ApiService);
  dataService = inject(DataService);
  users = this.dataService.users;
  cdr = inject(ChangeDetectorRef);

  deleteUser(id: string) {
    this.apiService
      .deleteUser(id)
      .pipe(
        switchMap(() => this.apiService.getUsers()),
        take(1)
      )
      .subscribe((res: any) => {
        this.users.set(res);
      });
  }

  ngOnInit(): void {
    // this.apiService.getUsers().subscribe((res: any) => {
    //   this.users.set(res);
    // });
    // this.dataService.getRoles().subscribe();
  }
}
