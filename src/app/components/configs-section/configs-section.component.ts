import { DataService } from './../../services/data.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-configs-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configs-section.component.html',
  styleUrl: './configs-section.component.scss',
})
export class ConfigsSectionComponent implements OnInit {
  dataService = inject(DataService);

  configs: WritableSignal<any> = this.dataService.configs;

  deleteConfig(id: string) {
    this.dataService.deleteConfig(id).subscribe();
  }

  ngOnInit(): void {
    this.dataService.getConfigs().subscribe();
  }
}
