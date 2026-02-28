import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stat-usine',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: '../stat-mensuel/stat-mensuel.component.html',
  styleUrls: ['../stat-mensuel/stat-mensuel.component.scss']
})
export class StatUsineComponent {
  pageTitle = 'Statistique Usine';
  annees = ['2024', '2023', '2022'];
  types = ['Tous', 'Action Corrective', 'Action Préventive', 'Amélioration'];
  services = ['Tous', 'Usine A', 'Usine B', 'Usine C'];
  selectedAnnee = '2024';
  selectedType = 'Tous';
  selectedService = 'Tous';
  summaryCards = [
    { title: 'Total Usines', value: '3', icon: 'feather icon-home', color: 'primary' },
    { title: 'Actions Globales', value: '456', icon: 'feather icon-check-square', color: 'success' },
    { title: 'En Cours', value: '89', icon: 'feather icon-clock', color: 'warning' },
    { title: 'En Retard', value: '34', icon: 'feather icon-alert-circle', color: 'danger' }
  ];
  chartData = [
    { label: 'Usine A', creees: 180, terminees: 120 },
    { label: 'Usine B', creees: 150, terminees: 100 },
    { label: 'Usine C', creees: 126, terminees: 80 }
  ];
  maxValue = 200;
  tableData = [
    { mois: 'Usine A', creees: 180, terminees: 120, enCours: 40, retard: 20 },
    { mois: 'Usine B', creees: 150, terminees: 100, enCours: 35, retard: 15 },
    { mois: 'Usine C', creees: 126, terminees: 80, enCours: 30, retard: 16 }
  ];
  onFilterChange() {}
}
