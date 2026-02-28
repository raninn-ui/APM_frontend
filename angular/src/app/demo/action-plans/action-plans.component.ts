// angular import
import { Component, signal, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RadialGaugeComponent } from './radial-gauge.component';

interface Employee {
  id: number;
  name: string;
  role: 'Pilote' | 'Rédacteur' | 'Autre';
}

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  type: 'comment' | 'state_change' | 'rejection';
}

interface Action {
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
  state: 'P' | 'D' | 'C'; // P = Pending, D = Done, C = Closed
  closureComment?: string;
  efficacyRating?: number; // 1-4 for emoji rating
  comments?: Comment[];
  isRejected?: boolean;
}

interface ActionPlan {
  id: number;
  title: string;
  pilots: string[]; // Changed to array to support multiple pilots
  process: string;
  creationDate: string;
  modificationDate?: string;
  type: 'Mono-Pilote' | 'Multi-Pilote';
  status?: string;
  actions?: Action[];
}

@Component({
  selector: 'app-action-plans',
  standalone: true,
  imports: [SharedModule, CommonModule, RadialGaugeComponent],
  templateUrl: './action-plans.component.html',
  styleUrls: ['./action-plans.component.scss']
})
export class ActionPlansComponent {
  private modalService = inject(NgbModal);
  Math = Math; // Expose Math to template

  // List of available processes/services
  processes = [
    'Gestion des Ressources Humaines',
    'Gestion Financière',
    'Gestion de la Qualité',
    'Gestion des Risques',
    'Gestion des Projets',
    'Gestion des Opérations',
    'Gestion de la Conformité'
  ];

  // List of employees with Pilote or Rédacteur role
  employees: Employee[] = [
    { id: 1, name: 'GRITL Walid', role: 'Pilote' },
    { id: 2, name: 'Ahmed Benali', role: 'Pilote' },
    { id: 3, name: 'Fatima Zahra', role: 'Rédacteur' },
    { id: 4, name: 'Mohamed Karim', role: 'Pilote' },
    { id: 5, name: 'Leila Mansouri', role: 'Rédacteur' },
    { id: 6, name: 'Hassan Bouali', role: 'Pilote' },
    { id: 7, name: 'Nadia Saidani', role: 'Rédacteur' },
    { id: 8, name: 'Youssef Amrani', role: 'Pilote' }
  ];

  // Current user (pilot by default)
  currentUser = 'GRITL Walid';

  // Selected pilot value for multi-pilot dropdown
  selectedPilotValue = '';

  // View mode: 'list', 'detail' (plan detail), or 'action-detail'
  viewMode = signal<'list' | 'detail' | 'action-detail'>('list');
  selectedPlan = signal<ActionPlan | null>(null);

  // Pagination and filtering
  rowsPerPage = signal<number>(5);
  currentPage = signal<number>(1);
  searchTerm = signal<string>('');

  // Modal states
  showAddActionModal = signal<boolean>(false);
  showDocumentsModal = signal<boolean>(false);
  showActionDetailModal = signal<boolean>(false);
  selectedActionDetail = signal<Action | null>(null);

  // Form data for new action
  newAction = signal({
    theme: '',
    anomAmel: '',
    immeCorr: '',
    criticite: '',
    cause: '',
    action: '',
    responsable: '',
    delai: '',
    methodeEfficacite: '',
    commentaire: ''
  });

  // Form validation errors
  formErrors = signal<{ [key: string]: string }>({});

  // Inline editing
  editingCell = signal<{ actionId: number; field: string } | null>(null);
  editingValue = signal<string>('');

  // Action detail state management
  actionClosureComment = signal<string>('');
  actionClosureMethod = signal<string>('');
  actionClosureDate = signal<string>('');
  showClosureForm = signal<boolean>(false);

  efficacyComment = signal<string>('');
  efficacyRating = signal<number>(0);
  showRejectionForm = signal<boolean>(false);

  rejectionFormData = signal({
    titre: '',
    cause: '',
    responsable: '',
    delai: ''
  });

  toastMessage = signal<string>('');
  showToast = signal<boolean>(false);

  // File upload
  uploadedFiles = signal<{ name: string; description: string; date: string }[]>([]);
  fileDescription = signal<string>('');
  hasUploadedFile = signal<boolean>(false);

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
          datePreveueVerification: '25/02/2026',
          dateVerification: '',
          efficacite: '',
          methodeEfficacite: '',
          commentaire: '',
          state: 'P',
          comments: [
            {
              id: 1,
              author: 'GRITL Walid',
              text: 'Action créée',
              timestamp: '15/02/2026 10:30',
              type: 'state_change'
            }
          ]
        },
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
          dateRealisee: '',
          methodeVerification: 'Évaluation',
          datePreveueVerification: '01/03/2026',
          dateVerification: '',
          efficacite: '',
          methodeEfficacite: '',
          commentaire: '',
          state: 'P',
          comments: [
            {
              id: 1,
              author: 'Ahmed Benali',
              text: 'Action créée',
              timestamp: '16/02/2026 14:00',
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
      actions: []
    }
  ]);

  newPlan = signal({
    title: '',
    pilots: [this.currentUser],
    process: '',
    creationDate: this.getTodayDate(),
    type: 'Mono-Pilote' as const,
    selectedPilots: [this.currentUser]
  });

  openAddPlanModal(content: TemplateRef<any>): void {
    this.resetForm();
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  addNewPlan(modal: any): void {
    const selectedPilots = this.newPlan().selectedPilots;
    if (this.newPlan().title.trim() && this.newPlan().process.trim() && selectedPilots.length > 0) {
      const plan: ActionPlan = {
        id: Math.max(...this.actionPlans().map(p => p.id), 0) + 1,
        title: this.newPlan().title,
        pilots: selectedPilots,
        process: this.newPlan().process,
        creationDate: this.newPlan().creationDate,
        type: this.newPlan().type
      };

      this.actionPlans.update(plans => [...plans, plan]);
      this.resetForm();
      modal.dismiss();
    }
  }

  deletePlan(id: number): void {
    this.actionPlans.update(plans => plans.filter(p => p.id !== id));
  }

  resetForm(): void {
    this.newPlan.set({
      title: '',
      pilots: [this.currentUser],
      process: '',
      creationDate: this.getTodayDate(),
      type: 'Mono-Pilote',
      selectedPilots: [this.currentUser]
    });
  }

  onTypeChange(): void {
    const currentType = this.newPlan().type;
    if (currentType === 'Mono-Pilote') {
      // Keep only the current user for Mono-Pilote
      this.newPlan.update(plan => ({
        ...plan,
        selectedPilots: [this.currentUser]
      }));
    }
    // For Multi-Pilote, keep the selected pilots as is
  }

  addPilot(pilotName: string): void {
    const selectedPilots = this.newPlan().selectedPilots;
    if (!selectedPilots.includes(pilotName)) {
      this.newPlan.update(plan => ({
        ...plan,
        selectedPilots: [...selectedPilots, pilotName]
      }));
    }
  }

  removePilot(pilotName: string): void {
    this.newPlan.update(plan => ({
      ...plan,
      selectedPilots: plan.selectedPilots.filter(p => p !== pilotName)
    }));
  }

  viewPlanDetails(plan: ActionPlan): void {
    this.selectedPlan.set(plan);
    this.viewMode.set('detail');
  }

  backToList(): void {
    this.viewMode.set('list');
    this.selectedPlan.set(null);
  }

  addAction(): void {
    // TODO: Open modal to add new action
    console.log('Add action to plan:', this.selectedPlan()?.id);
  }

  deleteAction(actionId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette action?')) {
      const plan = this.selectedPlan();
      if (plan && plan.actions) {
        plan.actions = plan.actions.filter(a => a.id !== actionId);
        this.selectedPlan.set({ ...plan });
        // Update the main list
        const updatedPlans = this.actionPlans().map(p => p.id === plan.id ? plan : p);
        this.actionPlans.set(updatedPlans);
      }
    }
  }

  validatePlan(): void {
    const plan = this.selectedPlan();
    if (plan) {
      plan.status = 'Validé';
      this.selectedPlan.set({ ...plan });
      const updatedPlans = this.actionPlans().map(p => p.id === plan.id ? plan : p);
      this.actionPlans.set(updatedPlans);
      alert('Plan validé avec succès!');
    }
  }

  closePlan(): void {
    const plan = this.selectedPlan();
    if (plan) {
      plan.status = 'Clôturé';
      this.selectedPlan.set({ ...plan });
      const updatedPlans = this.actionPlans().map(p => p.id === plan.id ? plan : p);
      this.actionPlans.set(updatedPlans);
    }
  }

  isPlanClosed(): boolean {
    return this.selectedPlan()?.status === 'Clôturé';
  }

  exportToCSV(): void {
    const plan = this.selectedPlan();
    if (!plan || !plan.actions) return;

    const headers = ['Rédacteur', 'N°', 'Thème', 'DATE', 'ANOM/AMÉL', 'IMME/CORR', 'Criticité', 'Cause', 'Action', 'Responsable', 'Délai', 'Date Réalisée', 'Méthode vérification', 'Date prévue vérif', 'Date vérif', 'Efficacité', 'Méthode mesure', 'Commentaire'];

    const rows = plan.actions.map(a => [
      a.redacteur, a.id, a.theme, a.date, a.anomAmel, a.immeCorr, a.criticite, a.cause, a.action, a.responsable, a.delai, a.dateRealisee, a.methodeVerification, a.datePreveueVerification, a.dateVerification, a.efficacite, a.methodeEfficacite, a.commentaire
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan-${plan.id}-actions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  getTotalActions(): number {
    return this.selectedPlan()?.actions?.length || 0;
  }

  getActionsInProgress(): number {
    return this.selectedPlan()?.actions?.filter(a => a.dateRealisee === '').length || 0;
  }

  getCompletedActions(): number {
    return this.selectedPlan()?.actions?.filter(a => a.dateRealisee !== '').length || 0;
  }

  getOverdueActions(): number {
    // Actions en retard sont celles sans dateRealisee et dont le délai est passé
    const today = new Date();
    return this.selectedPlan()?.actions?.filter(a => {
      if (a.dateRealisee !== '') return false;
      const dueDate = new Date(a.delai.split('/').reverse().join('-'));
      return dueDate < today;
    }).length || 0;
  }

  getProgressPercentage(): number {
    const total = this.getTotalActions();
    if (total === 0) return 0;
    const completed = this.getCompletedActions();
    return Math.round((completed / total) * 100);
  }

  getFilteredActions(): Action[] {
    const actions = this.selectedPlan()?.actions || [];
    const search = this.searchTerm().toLowerCase();

    if (!search) return actions;

    return actions.filter(a =>
      a.theme.toLowerCase().includes(search) ||
      a.action.toLowerCase().includes(search) ||
      a.responsable.toLowerCase().includes(search)
    );
  }

  getPaginatedActions(): Action[] {
    const filtered = this.getFilteredActions();
    const start = (this.currentPage() - 1) * this.rowsPerPage();
    return filtered.slice(start, start + this.rowsPerPage());
  }

  getTotalPages(): number {
    return Math.ceil(this.getFilteredActions().length / this.rowsPerPage());
  }

  openAddActionModal(): void {
    this.newAction.set({
      theme: '',
      anomAmel: '',
      immeCorr: '',
      criticite: '',
      cause: '',
      action: '',
      responsable: '',
      delai: '',
      methodeEfficacite: '',
      commentaire: ''
    });
    this.formErrors.set({});
    this.showAddActionModal.set(true);
  }

  closeAddActionModal(): void {
    this.showAddActionModal.set(false);
  }

  validateAddActionForm(): boolean {
    const newActionData = this.newAction();
    const errors: { [key: string]: string } = {};

    if (!newActionData.theme || newActionData.theme.trim() === '') {
      errors['theme'] = 'Ce champ est obligatoire';
    }
    if (!newActionData.anomAmel || newActionData.anomAmel.trim() === '') {
      errors['anomAmel'] = 'Ce champ est obligatoire';
    }
    if (!newActionData.immeCorr || newActionData.immeCorr.trim() === '') {
      errors['immeCorr'] = 'Ce champ est obligatoire';
    }
    if (!newActionData.cause || newActionData.cause.trim() === '') {
      errors['cause'] = 'Ce champ est obligatoire';
    }
    if (!newActionData.responsable || newActionData.responsable.trim() === '') {
      errors['responsable'] = 'Ce champ est obligatoire';
    }
    if (!newActionData.action || newActionData.action.trim() === '') {
      errors['action'] = 'Ce champ est obligatoire';
    }
    if (!newActionData.criticite || newActionData.criticite.trim() === '') {
      errors['criticite'] = 'Ce champ est obligatoire';
    }
    if (!newActionData.delai || newActionData.delai.trim() === '') {
      errors['delai'] = 'Ce champ est obligatoire';
    }
    if (!newActionData.methodeEfficacite || newActionData.methodeEfficacite.trim() === '') {
      errors['methodeEfficacite'] = 'Ce champ est obligatoire';
    }

    this.formErrors.set(errors);
    return Object.keys(errors).length === 0;
  }

  addNewAction(): void {
    if (!this.validateAddActionForm()) {
      return;
    }

    const plan = this.selectedPlan();
    if (!plan || !plan.actions) return;

    const newActionData = this.newAction();

    const action: Action = {
      id: Math.max(...plan.actions.map(a => a.id), 0) + 1,
      redacteur: this.currentUser,
      theme: newActionData.theme,
      date: new Date().toLocaleDateString('fr-FR'),
      anomAmel: newActionData.anomAmel,
      immeCorr: newActionData.immeCorr,
      criticite: newActionData.criticite,
      cause: newActionData.cause,
      action: newActionData.action,
      responsable: newActionData.responsable,
      delai: newActionData.delai,
      dateRealisee: '',
      methodeVerification: '',
      datePreveueVerification: '',
      dateVerification: '',
      efficacite: '',
      methodeEfficacite: newActionData.methodeEfficacite,
      commentaire: '',
      state: 'P',
      comments: [
        {
          id: 1,
          author: this.currentUser,
          text: 'Action créée',
          timestamp: new Date().toLocaleString('fr-FR'),
          type: 'state_change'
        }
      ]
    };

    plan.actions.push(action);
    this.selectedPlan.set({ ...plan });
    const updatedPlans = this.actionPlans().map(p => p.id === plan.id ? plan : p);
    this.actionPlans.set(updatedPlans);
    this.currentPage.set(1);

    // Reset form
    this.newAction.set({
      theme: '',
      anomAmel: '',
      immeCorr: '',
      criticite: '',
      cause: '',
      action: '',
      responsable: '',
      delai: '',
      methodeEfficacite: '',
      commentaire: ''
    });
    this.formErrors.set({});
    this.showAddActionModal.set(false);
  }

  openActionDetail(action: Action): void {
    this.selectedActionDetail.set(action);
    this.viewMode.set('action-detail');
  }

  closeActionDetail(): void {
    this.viewMode.set('detail');
    this.selectedActionDetail.set(null);
    this.resetActionDetailState();
  }

  resetActionDetailState(): void {
    this.showClosureForm.set(false);
    this.actionClosureComment.set('');
    this.actionClosureMethod.set('');
    this.actionClosureDate.set('');
    this.efficacyComment.set('');
    this.efficacyRating.set(0);
    this.showRejectionForm.set(false);
    this.rejectionFormData.set({
      titre: '',
      cause: '',
      responsable: '',
      delai: ''
    });
  }

  // State transition methods
  initiateActionClosure(): void {
    this.showClosureForm.set(true);
  }

  submitActionClosure(): void {
    const action = this.selectedActionDetail();
    if (!action) return;

    // Check if file has been uploaded
    if (!this.hasUploadedFile()) {
      this.showToastMessage('⚠️ Veuillez uploader un fichier avant de clôturer l\'action');
      return;
    }

    const today = this.getTodayDate();
    action.dateRealisee = today;
    action.state = 'D';
    action.closureComment = this.actionClosureComment();
    action.methodeVerification = this.actionClosureMethod();
    action.dateVerification = this.actionClosureDate();

    // Add comment to history
    if (!action.comments) action.comments = [];
    action.comments.push({
      id: action.comments.length + 1,
      author: this.currentUser,
      text: `Action clôturée - ${this.actionClosureComment()}`,
      timestamp: new Date().toLocaleString('fr-FR'),
      type: 'state_change'
    });

    this.selectedActionDetail.set({ ...action });
    this.showClosureForm.set(false);
    this.showToastMessage('Action clôturée — Notification envoyée au pilote');
  }

  cancelActionClosure(): void {
    this.showClosureForm.set(false);
    this.actionClosureComment.set('');
    this.actionClosureMethod.set('');
    this.actionClosureDate.set('');
  }

  submitEfficacyValidation(): void {
    const action = this.selectedActionDetail();
    if (!action) return;

    // Check if file has been uploaded
    if (!this.hasUploadedFile()) {
      this.showToastMessage('⚠️ Veuillez uploader un fichier avant de valider l\'action');
      return;
    }

    action.state = 'C';
    action.efficacyRating = this.efficacyRating();
    action.efficacite = this.getEfficacyLabel(this.efficacyRating());

    if (!action.comments) action.comments = [];
    action.comments.push({
      id: action.comments.length + 1,
      author: this.currentUser,
      text: `Action vérifiée - Efficacité: ${action.efficacite}`,
      timestamp: new Date().toLocaleString('fr-FR'),
      type: 'state_change'
    });

    this.selectedActionDetail.set({ ...action });
    this.showToastMessage('Action Vérifiée ✅');
  }

  initiateRejection(): void {
    this.showRejectionForm.set(true);
  }

  submitRejection(): void {
    const action = this.selectedActionDetail();
    if (!action) return;

    action.isRejected = true;
    action.state = 'P';

    if (!action.comments) action.comments = [];
    action.comments.push({
      id: action.comments.length + 1,
      author: this.currentUser,
      text: `Action rejetée - Nouvelle action créée`,
      timestamp: new Date().toLocaleString('fr-FR'),
      type: 'rejection'
    });

    this.selectedActionDetail.set({ ...action });
    this.showRejectionForm.set(false);
    this.showToastMessage('Action rejetée - Nouvelle action créée');
  }

  cancelRejection(): void {
    this.showRejectionForm.set(false);
    this.rejectionFormData.set({
      titre: '',
      cause: '',
      responsable: '',
      delai: ''
    });
  }

  addComment(text: string): void {
    const action = this.selectedActionDetail();
    if (!action || !text.trim()) return;

    if (!action.comments) action.comments = [];
    action.comments.push({
      id: action.comments.length + 1,
      author: this.currentUser,
      text: text,
      timestamp: new Date().toLocaleString('fr-FR'),
      type: 'comment'
    });

    this.selectedActionDetail.set({ ...action });
  }

  showToastMessage(message: string): void {
    this.toastMessage.set(message);
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }

  getEfficacyLabel(rating: number): string {
    const labels = ['', 'Faible', 'Moyen', 'Bon', 'Excellent'];
    return labels[rating] || '';
  }

  getEfficacyEmoji(rating: number): string {
    const emojis = ['', '😞', '😐', '😊', '✅'];
    return emojis[rating] || '';
  }

  // File upload handler
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.fileDescription().trim()) {
      const newFile = {
        name: file.name,
        description: this.fileDescription(),
        date: new Date().toLocaleDateString('fr-FR')
      };

      const currentFiles = this.uploadedFiles();
      this.uploadedFiles.set([...currentFiles, newFile]);
      this.hasUploadedFile.set(true);

      this.fileDescription.set('');
      event.target.value = '';
      this.showToastMessage(`Fichier "${file.name}" uploadé avec succès`);
    } else if (!this.fileDescription().trim()) {
      this.showToastMessage('Veuillez ajouter une description');
    }
  }

  // Save verification method and date
  saveVerificationData(): void {
    const action = this.selectedActionDetail();
    if (!action) return;

    if (!action.dateVerification || !action.methodeVerification) {
      this.showToastMessage('Veuillez remplir tous les champs');
      return;
    }

    if (!action.comments) action.comments = [];
    action.comments.push({
      id: action.comments.length + 1,
      author: this.currentUser,
      text: `Vérification enregistrée - Méthode: ${action.methodeVerification}`,
      timestamp: new Date().toLocaleString('fr-FR'),
      type: 'state_change'
    });

    this.selectedActionDetail.set({ ...action });
    this.showToastMessage('Données de vérification enregistrées');
  }

  openDocumentsModal(): void {
    this.showDocumentsModal.set(true);
  }

  closeDocumentsModal(): void {
    this.showDocumentsModal.set(false);
  }

  getTodayDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Inline editing methods
  startEditingCell(actionId: number, field: string, currentValue: string): void {
    this.editingCell.set({ actionId, field });
    this.editingValue.set(currentValue || '');
  }

  saveEditingCell(): void {
    const editing = this.editingCell();
    if (!editing) return;

    const plan = this.selectedPlan();
    if (!plan || !plan.actions) return;

    const action = plan.actions.find(a => a.id === editing.actionId);
    if (!action) return;

    const newValue = this.editingValue();
    (action as any)[editing.field] = newValue;

    this.selectedPlan.set({ ...plan });
    const updatedPlans = this.actionPlans().map(p => p.id === plan.id ? plan : p);
    this.actionPlans.set(updatedPlans);

    this.editingCell.set(null);
    this.editingValue.set('');
  }

  cancelEditingCell(): void {
    this.editingCell.set(null);
    this.editingValue.set('');
  }

  isEditingCell(actionId: number, field: string): boolean {
    const editing = this.editingCell();
    return editing?.actionId === actionId && editing?.field === field;
  }
}

