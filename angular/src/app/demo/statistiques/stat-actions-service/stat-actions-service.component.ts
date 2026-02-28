import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stat-actions-service',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './stat-actions-service.component.html',
  styleUrls: ['./stat-actions-service.component.scss']
})
export class StatActionsServiceComponent {
  pageTitle = 'Statistique des Actions Par Service/Responsable';
  
  annees = ['2024', '2023', '2022'];
  types = ['Tous', 'Action Corrective', 'Action Préventive', 'Amélioration'];
  services = ['Tous', 'Production', 'Qualité', 'Maintenance', 'RH', 'Finance'];
  
  selectedAnnee = '2024';
  selectedType = 'Tous';
  selectedService = 'Tous';

  summaryCards = [
    { title: 'Total Actions', value: '156', icon: 'feather icon-check-square', color: 'primary' },
    { title: 'Actions Terminées', value: '98', icon: 'feather icon-check-circle', color: 'success' },
    { title: 'Actions En Cours', value: '42', icon: 'feather icon-clock', color: 'warning' },
    { title: 'Actions En Retard', value: '16', icon: 'feather icon-alert-circle', color: 'danger' }
  ];

  chartData = [
    { label: 'Prod', creees: 45, terminees: 32 },
    { label: 'Qual', creees: 38, terminees: 28 },
    { label: 'Maint', creees: 25, terminees: 18 },
    { label: 'RH', creees: 20, terminees: 10 },
    { label: 'Fin', creees: 18, terminees: 10 },
    { label: 'Log', creees: 10, terminees: 5 }
  ];

  maxValue = 50;

  tableData = [
    { service: 'Production', total: 45, terminees: 32, enCours: 10, retard: 3 },
    { service: 'Qualité', total: 38, terminees: 28, enCours: 7, retard: 3 },
    { service: 'Maintenance', total: 25, terminees: 18, enCours: 5, retard: 2 },
    { service: 'RH', total: 20, terminees: 10, enCours: 8, retard: 2 },
    { service: 'Finance', total: 18, terminees: 10, enCours: 5, retard: 3 }
  ];

  onFilterChange() {}
}
