import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stat-efficacites-employes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: '../stat-mensuel/stat-mensuel.component.html',
  styleUrls: ['../stat-mensuel/stat-mensuel.component.scss']
})
export class StatEfficacitesEmployesComponent {
  pageTitle = 'Statistique des Efficacites par Employes';
  annees = ['2024', '2023'];
  types = ['Tous'];
  services = ['Tous', 'Production', 'Qualité'];
  selectedAnnee = '2024';
  selectedType = 'Tous';
  selectedService = 'Tous';
  summaryCards = [
    { title: 'Total Employes', value: '150', icon: 'feather icon-users', color: 'primary' },
    { title: 'Efficacite Moyenne', value: '78%', icon: 'feather icon-trending-up', color: 'success' },
    { title: 'Au Dessus', value: '45', icon: 'feather icon-arrow-up', color: 'warning' },
    { title: 'En Amelioration', value: '30', icon: 'feather icon-refresh-cw', color: 'danger' }
  ];
  chartData = [
    { label: 'Emp A', creees: 85, terminees: 80 },
    { label: 'Emp B', creees: 75, terminees: 70 },
    { label: 'Emp C', creees: 90, terminees: 85 },
    { label: 'Emp D', creees: 65, terminees: 60 },
    { label: 'Emp E', creees: 80, terminees: 75 }
  ];
  maxValue = 100;
  tableData = [
    { mois: 'Employe A', creees: 85, terminees: 80, enCours: 5, retard: 0 },
    { mois: 'Employe B', creees: 75, terminees: 70, enCours: 3, retard: 2 },
    { mois: 'Employe C', creees: 90, terminees: 85, enCours: 5, retard: 0 }
  ];
  onFilterChange() {}
}
