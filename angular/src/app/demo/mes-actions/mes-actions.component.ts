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

interface ActionFile {
  id: number;
  name: string;
  description: string;
  uploadDate: string;
}

interface Action {
  id: number;
  title: string;
  planName: string;
  state: 'P' | 'D' | 'C';
  deadline: string;
  responsable: string;
  pilote: string;
  theme: string;
  prevCorr: 'Preventive' | 'Corrective';
  anomAmel: string;
  dateCreation: string;
  criticite: string;
  efficacite: string;
  description: string;
  cause: string;
  commentaire: string;
  dateRealisee?: string;
  commentaireClosture?: string;
  methodVerification?: string;
  dateVerification?: string;
  efficacityRating?: number;
  files?: ActionFile[];
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
  // View mode: 'list' for Interface 1, 'detail' for Interface 2
  viewMode = signal<'list' | 'detail'>('list');

  // State management
  selectedAction = signal<Action | null>(null);
  filterState = signal<'all' | 'P' | 'D' | 'C'>('all');
  sortBy = signal<'deadline' | 'state'>('deadline');
  toastMessage = signal('');
  showToast = signal(false);
  toastType = signal<'success' | 'error' | 'info'>('success');

  // Form states for closure
  closureComment = signal('');
  verificationMethod = signal('');
  verificationDate = signal('');
  showClosureForm = signal(false);

  // New comment input
  newComment = signal('');

  // File upload
  fileDescription = signal('');

  // Current user
  currentUser = 'Ahmed Benali';

  // Mock data
  actions = signal<Action[]>([
    {
      id: 1,
      title: 'Ameliorer la documentation des processus',
      planName: 'Plan Qualite 2026',
      state: 'P',
      deadline: '2026-03-15',
      responsable: 'Ahmed Benali',
      pilote: 'GRITL Walid',
      theme: 'Documentation',
      prevCorr: 'Preventive',
      anomAmel: 'Amelioration',
      dateCreation: '2026-02-01',
      criticite: 'Haute',
      efficacite: 'N/A',
      description: 'Documenter tous les processus critiques de production',
      cause: 'Manque de documentation standardisee',
      commentaire: 'Action prioritaire pour Q1',
      files: [
        { id: 1, name: 'template_doc.docx', description: 'Template de documentation', uploadDate: '2026-02-15' }
      ],
      comments: [
        { id: 1, author: 'Ahmed Benali', text: 'Action creee', timestamp: '2026-02-01 10:30', type: 'state_change' }
      ]
    },
    {
      id: 2,
      title: 'Reduire les delais de traitement',
      planName: 'Plan Operations 2026',
      state: 'D',
      deadline: '2026-02-28',
      responsable: 'Fatima Zahra',
      pilote: 'Ahmed Benali',
      theme: 'Efficacite',
      prevCorr: 'Corrective',
      anomAmel: 'Amelioration',
      dateCreation: '2026-01-15',
      criticite: 'Moyenne',
      efficacite: 'N/A',
      description: 'Optimiser les workflows de production pour reduire les delais',
      cause: 'Processus inefficaces et goulots d\'etranglement',
      commentaire: 'En cours de realisation - resultats positifs',
      dateRealisee: '2026-02-25',
      commentaireClosture: 'Realise avec succes - reduction de 15% des delais',
      methodVerification: 'Tests de performance et mesure des KPIs',
      files: [
        { id: 2, name: 'rapport_optimisation.pdf', description: 'Rapport d\'optimisation', uploadDate: '2026-02-25' },
        { id: 3, name: 'metriques_performance.xlsx', description: 'Metriques de performance', uploadDate: '2026-02-26' }
      ],
      comments: [
        { id: 1, author: 'Fatima Zahra', text: 'Action demarree', timestamp: '2026-01-15 09:00', type: 'state_change' },
        { id: 2, author: 'Ahmed Benali', text: 'Premiers resultats encourageants', timestamp: '2026-02-20 14:30', type: 'comment' },
        { id: 3, author: 'Fatima Zahra', text: 'Action clôturee - objectifs atteints', timestamp: '2026-02-25 16:45', type: 'state_change' }
      ]
    },
    {
      id: 3,
      title: 'Former l\'equipe aux nouveaux outils',
      planName: 'Plan RH 2026',
      state: 'C',
      deadline: '2026-02-20',
      responsable: 'Mohamed Karim',
      pilote: 'GRITL Walid',
      theme: 'Formation',
      prevCorr: 'Preventive',
      anomAmel: 'Amelioration',
      dateCreation: '2026-01-10',
      criticite: 'Basse',
      efficacite: '4',
      description: 'Sessions de formation pour tous les employes sur les nouveaux outils',
      cause: 'Adoption de nouveaux outils et systemes',
      commentaire: 'Formation completee avec succes',
      dateRealisee: '2026-02-18',
      commentaireClosture: 'Formation reussie - 95% de participation',
      methodVerification: 'Evaluation des participants et tests pratiques',
      dateVerification: '2026-02-20',
      efficacityRating: 4,
      files: [
        { id: 4, name: 'slides_formation.pptx', description: 'Slides de formation', uploadDate: '2026-02-18' },
        { id: 5, name: 'resultats_evaluation.pdf', description: 'Resultats d\'evaluation', uploadDate: '2026-02-20' }
      ],
      comments: [
        { id: 1, author: 'Mohamed Karim', text: 'Formation demarree', timestamp: '2026-01-10 08:00', type: 'state_change' },
        { id: 2, author: 'Mohamed Karim', text: 'Sessions completees avec succes', timestamp: '2026-02-18 17:00', type: 'state_change' },
        { id: 3, author: 'GRITL Walid', text: 'Verification effectuee - action validee', timestamp: '2026-02-20 15:30', type: 'state_change' }
      ]
    },
    {
      id: 4,
      title: 'Mettre en place un systeme de monitoring',
      planName: 'Plan Qualite 2026',
      state: 'P',
      deadline: '2026-03-01',
      responsable: 'Leila Mansouri',
      pilote: 'Ahmed Benali',
      theme: 'Monitoring',
      prevCorr: 'Preventive',
      anomAmel: 'Amelioration',
      dateCreation: '2026-02-05',
      criticite: 'Haute',
      efficacite: 'N/A',
      description: 'Installer les outils de monitoring en temps reel pour tous les processus critiques',
      cause: 'Besoin de visibilite et de traçabilite des operations',
      commentaire: 'Urgent - impact sur la qualite',
      files: [],
      comments: [
        { id: 1, author: 'Leila Mansouri', text: 'Action creee', timestamp: '2026-02-05 11:00', type: 'state_change' }
      ]
    },
    {
      id: 5,
      title: 'Audit de conformite',
      planName: 'Plan Conformite 2026',
      state: 'D',
      deadline: '2026-02-15',
      responsable: 'Hassan Bouali',
      pilote: 'GRITL Walid',
      theme: 'Conformite',
      prevCorr: 'Corrective',
      anomAmel: 'Anomalie',
      dateCreation: '2026-01-20',
      criticite: 'Haute',
      efficacite: 'N/A',
      description: 'Effectuer audit complet de conformite reglementaire',
      cause: 'Verification reglementaire obligatoire',
      commentaire: 'En cours - audit externe en cours',
      dateRealisee: '2026-02-14',
      commentaireClosture: 'Audit realise - resultats en attente',
      methodVerification: 'Verification documentaire et audit externe',
      files: [
        { id: 6, name: 'checklist_audit.xlsx', description: 'Checklist d\'audit', uploadDate: '2026-02-10' }
      ],
      comments: [
        { id: 1, author: 'Hassan Bouali', text: 'Audit demarree', timestamp: '2026-01-20 09:30', type: 'state_change' },
        { id: 2, author: 'Hassan Bouali', text: 'Audit realise - en attente des resultats', timestamp: '2026-02-14 17:00', type: 'state_change' }
      ]
    },
    {
      id: 6,
      title: 'Optimiser les couts d\'exploitation',
      planName: 'Plan Operations 2026',
      state: 'P',
      deadline: '2026-02-10',
      responsable: 'Nadia Saidani',
      pilote: 'Ahmed Benali',
      theme: 'Couts',
      prevCorr: 'Corrective',
      anomAmel: 'Amelioration',
      dateCreation: '2026-01-25',
      criticite: 'Moyenne',
      efficacite: 'N/A',
      description: 'Reduire les depenses d\'exploitation de 10% sans impacter la qualite',
      cause: 'Optimisation budgetaire et reduction des couts',
      commentaire: 'A demarrer - analyse en cours',
      files: [],
      comments: [
        { id: 1, author: 'Nadia Saidani', text: 'Action creee', timestamp: '2026-01-25 10:00', type: 'state_change' }
      ]
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
    this.viewMode.set('detail');
    this.showClosureForm.set(false);
    this.resetClosureForm();
  }

  goBackToList() {
    this.viewMode.set('list');
    this.selectedAction.set(null);
    this.resetClosureForm();
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
      case 'P': return 'Planifie';
      case 'D': return 'Realise';
      case 'C': return 'Verifie';
      default: return state;
    }
  }

  // Closure workflow
  openClosureForm() {
    this.showClosureForm.set(true);
  }

  resetClosureForm() {
    this.closureComment.set('');
    this.verificationMethod.set('');
    this.verificationDate.set('');
    this.showClosureForm.set(false);
  }

  saveClosure() {
    const action = this.selectedAction();
    if (!action) return;

    // Update action state and details
    action.state = 'D';
    action.dateRealisee = new Date().toISOString().split('T')[0];
    action.commentaireClosture = this.closureComment();
    action.methodVerification = this.verificationMethod();
    action.dateVerification = this.verificationDate();

    // Add comment to history
    const newComment: Comment = {
      id: (action.comments?.length || 0) + 1,
      author: this.currentUser,
      text: `Action clôturee - ${this.closureComment()}`,
      timestamp: new Date().toLocaleString('fr-FR'),
      type: 'state_change'
    };

    if (!action.comments) action.comments = [];
    action.comments.push(newComment);

    // Update the action in the list
    const actions = this.actions();
    const index = actions.findIndex(a => a.id === action.id);
    if (index !== -1) {
      actions[index] = action;
      this.actions.set([...actions]);
    }

    this.selectedAction.set(action);
    this.resetClosureForm();
    this.showToastMessage('Action clôturee - Notification envoyee au pilote', 'success');
  }

  addComment() {
    const action = this.selectedAction();
    if (!action || !this.newComment()) return;

    const comment: Comment = {
      id: (action.comments?.length || 0) + 1,
      author: this.currentUser,
      text: this.newComment(),
      timestamp: new Date().toLocaleString('fr-FR'),
      type: 'comment'
    };

    if (!action.comments) action.comments = [];
    action.comments.push(comment);

    // Update the action in the list
    const actions = this.actions();
    const index = actions.findIndex(a => a.id === action.id);
    if (index !== -1) {
      actions[index] = action;
      this.actions.set([...actions]);
    }

    this.selectedAction.set(action);
    this.newComment.set('');
  }

  showToastMessage(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }
}

