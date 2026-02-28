import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stat-pilotes-service',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: '../stat-mensuel/stat-mensuel.component.html',
  styleUrls: ['../stat-mensuel/stat-mensuel.component.scss']
})
export class StatPilotesServiceComponent {
  pageTitle = 'Statistique des Pilotes par Service';
  annees = ['2024', '2023', '2022'];
  types = ['Tous'];
  services = [ 'Gérer les ressources Materielles', 'Piloter le centre',"Gérer les sysyteme D'information","Commercialiser","Dérogation","Direction Administrative et financiére","Gérer Les Ressources Humaines","Systéme & AC","Fabriquer","Gérer Les Achats","Industrialisation","Gérer La Supply Chain"];
  selectedAnnee = '2024';
  selectedType = 'Tous';
  selectedService = 'Tous';
  summaryCards = [
    { title: 'Total Pilotes', value: '15', icon: 'feather icon-target', color: 'primary' },
    { title: 'Actions Suivies', value: '89', icon: 'feather icon-eye', color: 'success' },
    { title: 'En Cours', value: '34', icon: 'feather icon-clock', color: 'warning' },
    { title: 'En Retard', value: '12', icon: 'feather icon-alert-circle', color: 'danger' }
  ];
  chartData = [
    { label: 'P1', creees: 25, terminees: 18 },
    { label: 'P2', creees: 20, terminees: 15 },
    { label: 'P3', creees: 18, terminees: 12 },
    { label: 'P4', creees: 15, terminees: 10 },
    { label: 'P5', creees: 11, terminees: 8 }
  ];
  maxValue = 30;
  tableData = [
    { mois: 'Pilote 1', creees: 25, terminees: 18, enCours: 5, retard: 2 },
    { mois: 'Pilote 2', creees: 20, terminees: 15, enCours: 3, retard: 2 },
    { mois: 'Pilote 3', creees: 18, terminees: 12, enCours: 4, retard: 2 }
  ];
  onFilterChange() {}
}
