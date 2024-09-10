import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
  dataService = inject(DataService);
  emitData = output<any>();
  roles = this.dataService.roles;
  chosenRole = signal<any>({});

  registrationForm = new FormGroup({
    firstname: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastname: new FormControl('', []),
    email: new FormControl('', [Validators.required, Validators.email]),
    // password: new FormControl('', [
    //   Validators.required,
    //   Validators.minLength(6),
    // ]),
    roles: new FormControl<any>('', [Validators.required]),
  });

  onSubmit(isRedirected: boolean = false) {
    const formData = this.registrationForm.value;
    formData.roles = formData.roles ? [formData.roles] : [];
    console.log(formData, isRedirected);
    this.emitData.emit({ formData, isRedirected });
    this.registrationForm.reset();
    this.chosenRole.set({});
  }

  ngOnInit(): void {
    this.registrationForm.valueChanges.subscribe();
    this.registrationForm.get('roles')?.valueChanges.subscribe((val) => {
      const roleFromInput = this.roles().find((role: any) => role.id == val);
      this.chosenRole.set({
        id: roleFromInput.id,
        description: roleFromInput.description,
      });
      console.log(this.chosenRole());
    });
  }
}
