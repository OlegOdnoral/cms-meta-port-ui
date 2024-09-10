import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-addconfig',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addconfig.component.html',
  styleUrl: './addconfig.component.scss',
})
export class AddconfigComponent {
  imgUrl = signal<string | null>(null);
  emitData = output<any>();

  configsForm = new FormGroup({
    address: new FormControl('', [Validators.required]),
    header_img: new FormControl(''),
    partner_id: new FormControl('', [Validators.required]),
    is_active: new FormControl(true),
    budget: new FormControl(''),
    color_schemas: new FormControl(null),
    avatar: new FormControl(''),
  });

  setUrl(val: string | null) {
    this.imgUrl.set(val);

    console.log(this.imgUrl());
  }

  onSubmit() {
    this.emitData.emit(this.configsForm.value);
    console.log(this.configsForm.value);

    this.configsForm.reset();
  }

  ngOnInit(): void {
    this.configsForm.valueChanges.subscribe();
    this.configsForm.get('avatar')?.valueChanges.subscribe((val) => {
      this.setUrl(val);
    });
  }
}
