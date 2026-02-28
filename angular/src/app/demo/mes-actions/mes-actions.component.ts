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

// Action interface from Plans d'Action
interface ActionFromPlan {
  id: number;
  redacteur: string;
  theme: string;
  date: string;
  anomAmel: string;
  immeCorr: string;
  criticite: string;
  cause: string;
  action: string;
  responsable: string;
  delai: string;
  dateRealisee: string;
  methodeVerification: string;
  datePreveueVerification: string;
  dateVerification: string;
  efficacite: string;
  methodeEfficacite: string;
  commentaire: string;
  state: 'P' | 'D' | 'C';
  closureComment?: string;
  efficacyRating?: number;
  comments?: Comment[];
  isRejected?: boolean;
}

interface ActionPlan {
  id: number;
  title: string;
  pilots: string[];
  process: string;
  creationDate: string;
  modificationDate?: string;
  type: 'Mono-Pilote' | 'Multi-Pilote';
  status?: string;
  actions?: ActionFromPlan[];
}

// Transformed Action for Mes Actions display
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

  // Action Plans data (same as in action-plans component)
  actionPlans = signal<ActionPlan[]>([
    {
      id: 1,
      title: 'Améliorer la performance',
      pilots: ['GRITL Walid'],
      process: 'Gestion des Opérations',
      creationDate: '15/02/2026',
      type: 'Mono-Pilote',
      status: 'Modifié',
      actions: [
        {
          id: 1,
          redacteur: 'GRITL Walid',
          theme: 'Optimisation des processus',
          date: '15/02/2026',
          anomAmel: 'Amélioration',
          immeCorr: 'Immédiat',
          criticite: 'Critique',
          cause: 'Processus inefficace',
          action: 'Analyser et optimiser le flux de travail',
          responsable: 'Ahmed Benali',
          delai: '20/02/2026',
          dateRealisee: '',
          methodeVerification: '',
          datePreveueVerification: '',
          dateVerification: '',
          efficacite: '',
          methodeEfficacite: '',
          commentaire: 'Action en cours',
          state: 'P',
          comments: [
            {
              id: 1,
              author: 'GRITL Walid',
              text: 'Action créée',
              timestamp: '15/02/2026 10:00',
              type: 'state_change'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Mise à jour de la documentation',
      pilots: ['GRITL Walid', 'Ahmed Benali', 'Fatima Zahra'],
      process: 'Gestion de la Qualité',
      creationDate: '10/02/2026',
      type: 'Multi-Pilote',
      status: 'Modifié',
      actions: [
        {
          id: 3,
          redacteur: 'Fatima Zahra',
          theme: 'Documentation qualité',
          date: '10/02/2026',
          anomAmel: 'Anomalie',
          immeCorr: 'Immédiat',
          criticite: 'Critique',
          cause: 'Documentation obsolète',
          action: 'Mettre à jour tous les documents',
          responsable: 'Leila Mansouri',
          delai: '28/02/2026',
          dateRealisee: '22/02/2026',
          methodeVerification: 'Revue documentaire',
          datePreveueVerification: '01/03/2026',
          dateVerification: '28/02/2026',
          efficacite: 'Efficace',
          methodeEfficacite: 'Indicateur',
          commentaire: '',
          state: 'C',
          comments: [
            {
              id: 1,
              author: 'Fatima Zahra',
              text: 'Action créée',
              timestamp: '10/02/2026 09:00',
              type: 'state_change'
            },
            {
              id: 2,
              author: 'Leila Mansouri',
              text: 'Action clôturée - Documentation mise à jour',
              timestamp: '22/02/2026 16:30',
              type: 'state_change'
            },
            {
              id: 3,
              author: 'GRITL Walid',
              text: 'Action vérifiée - Efficacité: Efficace',
              timestamp: '28/02/2026 10:00',
              type: 'state_change'
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Formation de l\'équipe',
      pilots: ['GRITL Walid'],
      process: 'Gestion des Ressources Humaines',
      creationDate: '05/02/2026',
      type: 'Mono-Pilote',
      status: 'Modifié',
      actions: [
        {
          id: 2,
          redacteur: 'Ahmed Benali',
          theme: 'Formation équipe',
          date: '16/02/2026',
          anomAmel: 'Amélioration',
          immeCorr: 'Court terme',
          criticite: 'Majeure',
          cause: 'Manque de compétences',
          action: 'Organiser sessions de formation',
          responsable: 'Fatima Zahra',
          delai: '28/02/2026',
          dateRealisee: '25/02/2026',
          methodeVerification: 'Évaluation',
          datePreveueVerification: '01/03/2026',
          dateVerification: '28/02/2026',
          efficacite: 'Très efficace',
          methodeEfficacite: 'Feedback',
          commentaire: 'Formation réussie',
          state: 'D',
          comments: [
            {
              id: 1,
              author: 'Ahmed Benali',
              text: 'Action créée',
              timestamp: '16/02/2026 14:00',
              type: 'state_change'
            },
            {
              id: 2,
              author: 'Fatima Zahra',
              text: 'Formation réalisée avec succès',
              timestamp: '25/02/2026 17:00',
              type: 'state_change'
            }
          ]
        }
      ]
    }
  ]);

  // Transformed actions from plans
  actions = signal<Action[]>([]);

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
    // Transform actions from plans
    this.transformActionsFromPlans();

    // Initialize with first action selected
    if (this.actions().length > 0) {
      this.selectedAction.set(this.actions()[0]);
    }
  }

  // Transform actions from ActionPlan format to Action format
  transformActionsFromPlans() {
    const transformedActions: Action[] = [];

    this.actionPlans().forEach(plan => {
      if (plan.actions && plan.actions.length > 0) {
        plan.actions.forEach(planAction => {
          const transformedAction: Action = {
            id: planAction.id,
            title: planAction.action,
            planName: plan.title,
            state: planAction.state,
            deadline: this.convertDateFormat(planAction.delai),
            responsable: planAction.responsable,
            pilote: plan.pilots[0] || 'N/A',
            theme: planAction.theme,
            prevCorr: planAction.immeCorr === 'Immédiat' ? 'Preventive' : 'Corrective',
            anomAmel: planAction.anomAmel,
            dateCreation: this.convertDateFormat(planAction.date),
            criticite: planAction.criticite,
            efficacite: planAction.efficacite || 'N/A',
            description: planAction.action,
            cause: planAction.cause,
            commentaire: planAction.commentaire,
            dateRealisee: planAction.dateRealisee ? this.convertDateFormat(planAction.dateRealisee) : undefined,
            commentaireClosture: planAction.closureComment,
            methodVerification: planAction.methodeVerification,
            dateVerification: planAction.dateVerification ? this.convertDateFormat(planAction.dateVerification) : undefined,
            efficacityRating: planAction.efficacyRating,
            files: [],
            comments: planAction.comments || []
          };
          transformedActions.push(transformedAction);
        });
      }
    });

    this.actions.set(transformedActions);
  }

  // Convert date from DD/MM/YYYY to YYYY-MM-DD
  convertDateFormat(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
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

