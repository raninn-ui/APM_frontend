import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.scss']
})
export class StatistiquesComponent {
  activeStat: string = 'mensuel';

  stats = [
    { id: 'mensuel', title: 'Statistique Mensuel', icon: 'feather icon-calendar' },
    { id: 'actions-service', title: 'Statistique des Actions Par Service/Responsable', icon: 'feather icon-users' },
    { id: 'usine', title: 'Statistique Usine', icon: 'feather icon-home' },
    { id: 'responsables', title: 'Statistique des Responsables', icon: 'feather icon-user-check' },
    { id: 'pilotes-service', title: 'Statistique des Pilotes par Service', icon: 'feather icon-target' },
    { id: 'efficacites-employes', title: 'Statistique des Efficacites par Employes', icon: 'feather icon-trending-up' },
    { id: 'actions-employes', title: 'Statistique des Actions par Employes', icon: 'feather icon-user' },
    { id: 'verification', title: 'Statistique des Verification', icon: 'feather icon-check-circle' },
    { id: 'responsables-verification', title: 'Statistique des Responsables de Verification', icon: 'feather icon-shield' }
  ];

  setActiveStat(statId: string) {
    this.activeStat = statId;
  }

  getActiveStatTitle(): string {
    const stat = this.stats.find(s => s.id === this.activeStat);
    return stat ? stat.title : '';
  }

  // Dummy data for demonstration
  getChartData() {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        { label: 'Actions completes', data: [65, 59, 80, 81, 56, 55], borderColor: '#409fff', backgroundColor: 'rgba(64, 159, 255, 0.1)' },
        { label: 'Actions en cours', data: [28, 48, 40, 19, 86, 27], borderColor: '#f50057', backgroundColor: 'rgba(245, 0, 87, 0.1)' }
      ]
    };
  }

  getSummaryCards() {
    return [
      { title: 'Total Actions', value: '156', icon: 'feather icon-check-square', color: 'primary' },
      { title: 'Actions Terminees', value: '98', icon: 'feather icon-check-circle', color: 'success' },
      { title: 'Actions En Cours', value: '42', icon: 'feather icon-clock', color: 'warning' },
      { title: 'Actions En Retard', value: '16', icon: 'feather icon-alert-circle', color: 'danger' }
    ];
  }
}
