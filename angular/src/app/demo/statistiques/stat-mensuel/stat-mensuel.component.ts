import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stat-mensuel',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './stat-mensuel.component.html',
  styleUrls: ['./stat-mensuel.component.scss']
})
export class StatMensuelComponent {
  pageTitle = 'Statistique Mensuel';
  
  // Filter options
  annees = ['2024', '2023', '2022'];
  types = ['Tous', 'Action Corrective', 'Action Préventive', 'Amélioration'];
  services = ['Tous', 'Production', 'Qualité', 'Maintenance', 'RH', 'Finance'];
  
  selectedAnnee = '2024';
  selectedType = 'Tous';
  selectedService = 'Tous';

  // Summary cards data
  summaryCards = [
    { title: 'Total Actions', value: '245', icon: 'feather icon-check-square', color: 'primary' },
    { title: 'Actions Terminées', value: '178', icon: 'feather icon-check-circle', color: 'success' },
    { title: 'Actions En Cours', value: '45', icon: 'feather icon-clock', color: 'warning' },
    { title: 'Actions En Retard', value: '22', icon: 'feather icon-alert-circle', color: 'danger' }
  ];

  // Chart data
  chartData = [
    { label: 'Jan', creees: 12, terminees: 8 },
    { label: 'Fév', creees: 19, terminees: 12 },
    { label: 'Mar', creees: 15, terminees: 10 },
    { label: 'Avr', creees: 25, terminees: 18 },
    { label: 'Mai', creees: 22, terminees: 15 },
    { label: 'Juin', creees: 18, terminees: 12 }
  ];

  maxValue = 30;

  // Table data
  tableData = [
    { mois: 'Janvier', creees: 12, terminees: 8, enCours: 3, retard: 1 },
    { mois: 'Février', creees: 19, terminees: 12, enCours: 5, retard: 2 },
    { mois: 'Mars', creees: 15, terminees: 10, enCours: 3, retard: 2 },
    { mois: 'Avril', creees: 25, terminees: 18, enCours: 5, retard: 2 },
    { mois: 'Mai', creees: 22, terminees: 15, enCours: 4, retard: 3 }
  ];

  onFilterChange() {
    console.log('Filter changed:', this.selectedAnnee, this.selectedType, this.selectedService);
  }
}
