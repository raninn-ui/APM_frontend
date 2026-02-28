import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stat-actions-employes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: '../stat-mensuel/stat-mensuel.component.html',
  styleUrls: ['../stat-mensuel/stat-mensuel.component.scss']
})
export class StatActionsEmployesComponent {
  pageTitle = 'Statistique des Actions par Employes';
  annees = ['2024', '2023'];
  types = ['Tous'];
  services = ['Tous'];
  selectedAnnee = '2024';
  selectedType = 'Tous';
  selectedService = 'Tous';
  summaryCards = [
    { title: 'Total Employes', value: '150', icon: 'feather icon-user', color: 'primary' },
    { title: 'Actions Assignees', value: '320', icon: 'feather icon-briefcase', color: 'success' },
    { title: 'Terminees', value: '245', icon: 'feather icon-check', color: 'warning' },
    { title: 'En Retard', value: '28', icon: 'feather icon-alert-circle', color: 'danger' }
  ];
  chartData = [
    { label: 'E1', creees: 25, terminees: 20 },
    { label: 'E2', creees: 22, terminees: 18 },
    { label: 'E3', creees: 20, terminees: 15 },
    { label: 'E4', creees: 18, terminees: 14 },
    { label: 'E5', creees: 15, terminees: 12 }
  ];
  maxValue = 30;
  tableData = [
    { mois: 'Employe 1', creees: 25, terminees: 20, enCours: 3, retard: 2 },
    { mois: 'Employe 2', creees: 22, terminees: 18, enCours: 2, retard: 2 },
    { mois: 'Employe 3', creees: 20, terminees: 15, enCours: 3, retard: 2 }
  ];
  onFilterChange() {}
}
