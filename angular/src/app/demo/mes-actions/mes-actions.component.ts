import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  type: 'comment' | 'state_change' | 'rejection';
}

interface Action {
  id: number;
  title: string;
  planName: string;
  state: 'P' | 'D' | 'C';
  deadline: string;
  responsable: string;
  theme: string;
  prevCorr: 'Preventive' | 'Corrective';
  anomAmel: string;
  dateCreation: string;
  criticite: string;
  efficacite: string;
  description: string;
  cause: string;
  commentaire: string;
  pilote: string;
  dateRealisee?: string;
  commentaireClosture?: string;
  methodVerification?: string;
  dateVerification?: string;
  efficacityRating?: number;
  files?: { id: number; name: string; description: string; uploadDate: string }[];
  comments?: Comment[];
}

@Component({
  selector: 'app-mes-actions',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './mes-actions.component.html',
  styleUrls: ['./mes-actions.component.scss']
})
export class MesActionsComponent implements OnInit {
  // State management
  selectedAction = signal<Action | null>(null);
  filterState = signal<'all' | 'P' | 'D' | 'C'>('all');
  sortBy = signal<'deadline' | 'state'>('deadline');
  showDetailPage = signal(false);
  toastMessage = signal('');
  showToast = signal(false);

  // Form states
  closureComment = signal('');
  verificationMethod = signal('');
  verificationDate = signal('');
  newComment = signal('');
  fileDescription = signal('');

  // Mock data
  actions = signal<Action[]>([
    {
      id: 1,
      title: 'Ameliorer la documentation des processus',
      planName: 'Plan Qualite 2026',
      state: 'P',
      deadline: '2026-03-15',
      responsable: 'Ahmed Benali',
      theme: 'Documentation',
      prevCorr: 'Preventive',
      anomAmel: 'Amelioration',
      dateCreation: '2026-02-01',
      criticite: 'Haute',
      efficacite: 'N/A',
      description: 'Documenter tous les processus critiques',
      cause: 'Manque de documentation',
      commentaire: 'Action prioritaire',
      pilote: 'GRITL Walid',
      files: [],
      comments: []
    },
    {
      id: 2,
      title: 'Reduire les delais de traitement',
      planName: 'Plan Operations 2026',
      state: 'D',
      deadline: '2026-02-28',
      responsable: 'Fatima Zahra',
      theme: 'Efficacite',
      prevCorr: 'Corrective',
      anomAmel: 'Amelioration',
      dateCreation: '2026-01-15',
      criticite: 'Moyenne',
      efficacite: 'N/A',
      description: 'Optimiser les workflows',
      cause: 'Processus inefficaces',
      commentaire: 'En cours de realisation',
      pilote: 'Ahmed Benali',
      dateRealisee: '2026-02-25',
      commentaireClosture: 'Realise avec succes',
      methodVerification: 'Tests de performance',
      files: [],
      comments: []
    },
    {
      id: 3,
      title: 'Former l\'equipe aux nouveaux outils',
      planName: 'Plan RH 2026',
      state: 'C',
      deadline: '2026-02-20',
      responsable: 'Mohamed Karim',
      theme: 'Formation',
      prevCorr: 'Preventive',
      anomAmel: 'Amelioration',
      dateCreation: '2026-01-10',
      criticite: 'Basse',
      efficacite: '4',
      description: 'Sessions de formation pour tous',
      cause: 'Adoption de nouveaux outils',
      commentaire: 'Formation completee',
      pilote: 'GRITL Walid',
      dateRealisee: '2026-02-18',
      commentaireClosture: 'Formation reussie',
      methodVerification: 'Evaluation des participants',
      dateVerification: '2026-02-20',
      efficacityRating: 4,
      files: [],
      comments: []
    },
    {
      id: 4,
      title: 'Mettre en place un systeme de monitoring',
      planName: 'Plan Qualite 2026',
      state: 'P',
      deadline: '2026-03-01',
      responsable: 'Leila Mansouri',
      theme: 'Monitoring',
      prevCorr: 'Preventive',
      anomAmel: 'Amelioration',
      dateCreation: '2026-02-05',
      criticite: 'Haute',
      efficacite: 'N/A',
      description: 'Installer les outils de monitoring',
      cause: 'Besoin de visibilite',
      commentaire: 'Urgent',
      pilote: 'Ahmed Benali',
      files: [],
      comments: []
    },
    {
      id: 5,
      title: 'Audit de conformite',
      planName: 'Plan Conformite 2026',
      state: 'D',
      deadline: '2026-02-15',
      responsable: 'Hassan Bouali',
      theme: 'Conformite',
      prevCorr: 'Corrective',
      anomAmel: 'Anomalie',
      dateCreation: '2026-01-20',
      criticite: 'Haute',
      efficacite: 'N/A',
      description: 'Effectuer audit complet',
      cause: 'Verification reglementaire',
      commentaire: 'En cours',
      pilote: 'GRITL Walid',
      dateRealisee: '2026-02-14',
      commentaireClosture: 'Audit en cours',
      methodVerification: 'Verification documentaire',
      files: [],
      comments: []
    },
    {
      id: 6,
      title: 'Optimiser les couts d\'exploitation',
      planName: 'Plan Operations 2026',
      state: 'P',
      deadline: '2026-02-10',
      responsable: 'Nadia Saidani',
      theme: 'Couts',
      prevCorr: 'Corrective',
      anomAmel: 'Amelioration',
      dateCreation: '2026-01-25',
      criticite: 'Moyenne',
      efficacite: 'N/A',
      description: 'Reduire les depenses',
      cause: 'Optimisation budgetaire',
      commentaire: 'A demarrer',
      pilote: 'Ahmed Benali',
      files: [],
      comments: []
    }
  ]);

  // Computed filtered and sorted actions
  filteredActions = computed(() => {
    let filtered = this.actions();

    if (this.filterState() !== 'all') {
      filtered = filtered.filter(a => a.state === this.filterState());
    }

    return filtered.sort((a, b) => {
      if (this.sortBy() === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return a.state.localeCompare(b.state);
    });
  });

  ngOnInit() {
    // Initialize with first action selected
    if (this.actions().length > 0) {
      this.selectedAction.set(this.actions()[0]);
    }
  }

  selectAction(action: Action) {
    this.selectedAction.set(action);
    this.showDetailPage.set(true);
  }

  getDeadlineColor(deadline: string): string {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft > 3) return 'text-success';
    if (daysLeft >= 1) return 'text-warning';
    return 'text-danger';
  }

  getStateColor(state: string): string {
    switch (state) {
      case 'P': return 'secondary';
      case 'D': return 'warning';
      case 'C': return 'success';
      default: return 'secondary';
    }
  }

  getStateLabel(state: string): string {
    switch (state) {
      case 'P': return 'Planifié';
      case 'D': return 'Réalisé';
      case 'C': return 'Vérifié';
      default: return state;
    }
  }

  closeAction() {
    this.showDetailPage.set(false);
    this.selectedAction.set(null);
  }

  showToastMessage(message: string) {
    this.toastMessage.set(message);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }
}

