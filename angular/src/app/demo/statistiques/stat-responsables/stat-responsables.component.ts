import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stat-responsables',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: '../stat-mensuel/stat-mensuel.component.html',
  styleUrls: ['../stat-mensuel/stat-mensuel.component.scss']
})
export class StatResponsablesComponent {
  pageTitle = 'Statistique des Responsables';
  annees = ['2024', '2023', '2022'];
  types = ['Tous', 'Action Corrective', 'Action Préventive'];
  services = ['Tous', 'Production', 'Qualité', 'Maintenance'];
  selectedAnnee = '2024';
  selectedType = 'Tous';
  selectedService = 'Tous';
  summaryCards = [
    { title: 'Total Responsables', value: '25', icon: 'feather icon-user-check', color: 'primary' },
    { title: 'Actions Assignées', value: '189', icon: 'feather icon-user', color: 'success' },
    { title: 'En Cours', value: '56', icon: 'feather icon-clock', color: 'warning' },
    { title: 'En Retard', value: '18', icon: 'feather icon-alert-circle', color: 'danger' }
  ];
  chartData = [
    { label: 'Resp A', creees: 45, terminees: 32 },
    { label: 'Resp B', creees: 38, terminees: 28 },
    { label: 'Resp C', creees: 35, terminees: 25 },
    { label: 'Resp D', creees: 28, terminees: 20 },
    { label: 'Resp E', creees: 25, terminees: 18 },
    { label: 'Resp F', creees: 18, terminees: 12 }
  ];
  maxValue = 50;
  tableData = [
    { mois: 'Responsable A', creees: 45, terminees: 32, enCours: 10, retard: 3 },
    { mois: 'Responsable B', creees: 38, terminees: 28, enCours: 7, retard: 3 },
    { mois: 'Responsable C', creees: 35, terminees: 25, enCours: 8, retard: 2 }
  ];
  onFilterChange() {}
}
