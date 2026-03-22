import { Component, signal, inject, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
 
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RadialGaugeComponent } from './radial-gauge.component';
import { AuthService } from 'src/app/services/auth';
import { PlanService, PlanResponse, CreatePlanRequest, MembreDisponible } from 'src/app/services/plan.service';
import { ServiceService, ServiceItem } from 'src/app/services/service.service';
 
// ── Local interfaces ───────────────────────────────────────────────────────────
interface Comment {
  id: number; author: string; text: string;
  timestamp: string; type: 'comment' | 'state_change' | 'rejection';
}
 
interface Action {
  id: number; redacteur: string; theme: string; date: string;
  anomAmel: string; immeCorr: string; criticite: string; cause: string;
  action: string; responsable: string; delai: string; dateRealisee: string;
  methodeVerification: string; datePreveueVerification: string;
  dateVerification: string; efficacite: string; methodeEfficacite: string;
  commentaire: string; state: 'P' | 'D' | 'C';
  closureComment?: string; efficacyRating?: number;
  comments?: Comment[]; isRejected?: boolean;
}
 
interface ActionPlan {
  id: number;
  title: string;
  pilots: string[];
  pilotMatricule: number;
  coPilotMatricules: number[];
  redacteurMatricules: number[];
  redacteurs: string[];
  process: string;
  codeService: number | null;   // ✅ int
  matEmp: number;
  creationDate: string;
  modificationDate?: string;
  dateCloture?: string;
  type: string;
  status?: string;
  visibility?: string;
  tauxAvencement: number;
  totalActions: number;
  actionsEnCours: number;
  actionsCloturees: number;
  actionsEnRetard: number;
  estCloture: boolean;
  actions?: Action[];
}
 
@Component({
  selector: 'app-action-plans',
  standalone: true,
  imports: [SharedModule, CommonModule, RadialGaugeComponent],
  templateUrl: './action-plans.component.html',
  styleUrls: ['./action-plans.component.scss']
})
export class ActionPlansComponent implements OnInit {
  private modalService    = inject(NgbModal);
  private authService     = inject(AuthService);
  private planService     = inject(PlanService);
  private serviceService  = inject(ServiceService);
  private route           = inject(ActivatedRoute);
  Math = Math;
 
  // ── Page mode ─────────────────────────────────────────────────────────────
  private pageMode: 'mes-plans' | 'usine' = 'mes-plans';
  private usineServiceCode: number | null = null;   // ✅ int
  usineServiceLib = signal<string | null>(null);
 
  // ── State ─────────────────────────────────────────────────────────────────
  isLoading    = signal(false);
  errorMessage = signal<string | null>(null);
 
  // ── Services dropdown ─────────────────────────────────────────────────────
  servicesList = signal<ServiceItem[]>([]);
 
  // ── Members dropdowns ─────────────────────────────────────────────────────
  membresDisponibles         = signal<MembreDisponible[]>([]);
  selectedCoPilotMatricule   = signal<number | null>(null);
  selectedRedacteurMatricule = signal<number | null>(null);
  selectedCoPilots           = signal<MembreDisponible[]>([]);
  selectedRedacteurs         = signal<MembreDisponible[]>([]);
 
  get pilotesDisponibles(): MembreDisponible[] {
    return this.membresDisponibles().filter(m => m.role === 'Pilote');
  }
  get redacteursDisponibles(): MembreDisponible[] {
    return this.membresDisponibles().filter(m => m.role === 'Rédacteur');
  }
 
  // ── View ──────────────────────────────────────────────────────────────────
  viewMode     = signal<'list' | 'detail' | 'action-detail'>('list');
  selectedPlan = signal<ActionPlan | null>(null);
  rowsPerPage  = signal<number>(5);
  currentPage  = signal<number>(1);
  searchTerm   = signal<string>('');
 
  // ── Modals ────────────────────────────────────────────────────────────────
  showAddActionModal   = signal<boolean>(false);
  showDocumentsModal   = signal<boolean>(false);
  selectedActionDetail = signal<Action | null>(null);
 
  // ── Action form ───────────────────────────────────────────────────────────
  newAction = signal({
    theme: '', anomAmel: '', immeCorr: '', criticite: '',
    cause: '', action: '', responsable: '', delai: '',
    methodeEfficacite: '', commentaire: ''
  });
  formErrors = signal<{ [key: string]: string }>({});
 
  // ── Inline editing ────────────────────────────────────────────────────────
  editingCell  = signal<{ actionId: number; field: string } | null>(null);
  editingValue = signal<string>('');
 
  // ── Action detail ─────────────────────────────────────────────────────────
  actionClosureComment = signal<string>('');
  actionClosureMethod  = signal<string>('');
  actionClosureDate    = signal<string>('');
  showClosureForm      = signal<boolean>(false);
  efficacyComment      = signal<string>('');
  efficacyRating       = signal<number>(0);
  showRejectionForm    = signal<boolean>(false);
  rejectionFormData    = signal({ titre: '', cause: '', responsable: '', delai: '' });
 
  // ── Toast ─────────────────────────────────────────────────────────────────
  toastMessage = signal<string>('');
  showToast    = signal<boolean>(false);
 
  // ── Files ─────────────────────────────────────────────────────────────────
  uploadedFiles   = signal<{ name: string; description: string; date: string }[]>([]);
  fileDescription = signal<string>('');
  hasUploadedFile = signal<boolean>(false);
 
  // ── Plans data ────────────────────────────────────────────────────────────
  actionPlans = signal<ActionPlan[]>([]);
 
  // ── New plan form ─────────────────────────────────────────────────────────
  newPlan = signal({
    title: '',
    codeService: null as number | null,   // ✅ int
    creationDate: this.getTodayDate(),
    type: 'Mono-Pilote' as string,
    visibility: 'Public' as string,
    categorie: null as string | null,
  });
 
  // ─────────────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const codeStr = params.get('serviceCode');
      if (codeStr) {
        this.pageMode         = 'usine';
        this.usineServiceCode = parseInt(codeStr, 10);   // ✅ parse int
        const lib = this.route.snapshot.queryParams['serviceLib'];
        this.usineServiceLib.set(lib ?? codeStr);
      } else {
        this.pageMode         = 'mes-plans';
        this.usineServiceCode = null;
        this.usineServiceLib.set(null);
      }
      this.loadPlans();
    });
 
    this.loadMesServices();
    this.loadMembresDisponibles();
  }
 
  // ── Load plans ────────────────────────────────────────────────────────────
  loadPlans(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
 
    const obs$ = (this.pageMode === 'usine' && this.usineServiceCode)
      ? this.planService.getPublicPlansByService(this.usineServiceCode)   // ✅ int
      : this.planService.getMesPlans();
 
    obs$.subscribe({
      next: (plans) => {
        this.actionPlans.set(plans.map(p => this.mapPlanResponse(p)));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Erreur lors du chargement des plans');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }
 
  loadMesServices(): void {
    this.serviceService.getMesServices().subscribe({
      next: (services) => {
        this.servicesList.set(services);
        if (services.length === 1) {
          this.newPlan.update(p => ({ ...p, codeService: services[0].code }));   // ✅ int
        }
      },
      error: (err) => console.error('Services non chargés', err)
    });
  }
 
  loadMembresDisponibles(): void {
    this.planService.getMembresDisponibles().subscribe({
      next: (m) => this.membresDisponibles.set(m),
      error: (err) => console.error('Membres non chargés', err)
    });
  }
 
  // ── Mapper ────────────────────────────────────────────────────────────────
  private mapPlanResponse(p: PlanResponse): ActionPlan {
    return {
      id:               p.numPlan,
      title:            p.tiltre,
      pilots:           [...(p.nomPilote ? [p.nomPilote] : []), ...p.nomsCoPilotes],
      pilotMatricule:   p.matEmp,
      coPilotMatricules:   [],
      redacteurMatricules: [],
      redacteurs:       p.nomsRedacteurs,
      process:          p.serviceLib ?? String(p.codeService) ?? '',
      codeService:      p.codeService,   // ✅ int
      matEmp:           p.matEmp,
      creationDate:     p.dateCreation     ? new Date(p.dateCreation).toLocaleDateString('fr-FR')     : '',
      modificationDate: p.dateModification ? new Date(p.dateModification).toLocaleDateString('fr-FR') : undefined,
      dateCloture:      p.dateCloture      ? new Date(p.dateCloture).toLocaleDateString('fr-FR')      : undefined,
      type:             p.type,
      status:           p.etat ?? 'En cours',
      visibility:       p.visibilite,
      tauxAvencement:   p.tauxAvencement,
      totalActions:     p.totalActions,
      actionsEnCours:   p.actionsEnCours,
      actionsCloturees: p.actionsCloturees,
      actionsEnRetard:  p.actionsEnRetard,
      estCloture:       p.estCloture ?? false,
      actions:          []
    };
  }
 
  // ── Ownership & read-only ─────────────────────────────────────────────────
  private getCurrentMatricule(): number | null {
    const user = this.authService.getCurrentUser();
    if (!user) return null;
    const mat = parseInt(user.id, 10);
    return isNaN(mat) ? null : mat;
  }
 
  isMembreDuPlan(plan: ActionPlan): boolean {
    const matricule = this.getCurrentMatricule();
    if (!matricule) return false;
    if (plan.matEmp === matricule) return true;
    if (this.pageMode === 'mes-plans') return true;
    return false;
  }
 
  isPlanEditable(): boolean {
    const plan = this.selectedPlan();
    if (!plan) return false;
    if (plan.estCloture) return false;
    return this.isMembreDuPlan(plan);
  }
 
  isPlanReadOnly(): boolean { return !this.isPlanEditable(); }
 
  isPilotePrincipal(): boolean {
    const plan = this.selectedPlan();
    if (!plan || plan.estCloture) return false;
    return plan.matEmp === this.getCurrentMatricule();
  }
 
  // ── Page title ────────────────────────────────────────────────────────────
  getPageTitle(): string {
    return this.pageMode === 'usine'
      ? `Plans Usine — ${this.usineServiceLib() ?? ''}`
      : 'Mes plans d\'action';
  }

  /**
   * ✅ Can the logged-in user add a plan?
   * - In "mes-plans" mode → always yes (authenticated)
   * - In "usine" mode → only if the user has access to this service
   *   (i.e. the service appears in their servicesList from /api/service/mes-services)
   */
  canAddPlan(): boolean {
  // ✅ Doit être Pilote 
  const role = this.authService.getUserRole();
  const isPilote = role === 'Pilot' ;
  if (!isPilote) return false;

  // ✅ En mode mes-plans → toujours oui (déjà Pilote)
  if (this.pageMode === 'mes-plans') return true;

  // ✅ En mode usine → vérifier que ce service est dans les services autorisés de l'employé
  const allowed = this.servicesList();
  if (!allowed.length) return false;
  return allowed.some(s => s.code === this.usineServiceCode);
}
 
  // ── CRUD ──────────────────────────────────────────────────────────────────
  openAddPlanModal(content: TemplateRef<any>): void {
    this.resetForm();
    this.modalService.open(content, { size: 'lg', centered: true });
  }
 
  addNewPlan(modal: any): void {
    const form = this.newPlan();
    if (!form.title.trim() || !form.codeService) {
      this.showToastMessage('⚠️ Titre et processus sont obligatoires');
      return;
    }
 
    const request: CreatePlanRequest = {
      tiltre:      form.title.trim(),
      type:        form.type,
      visibilite:  form.visibility,
      codeService: form.codeService,   // ✅ int
      matEmp:      0,
      categorie:   form.categorie,
      coPilotes:   this.selectedCoPilots().map(m => m.matricule),
      redacteurs:  this.selectedRedacteurs().map(m => m.matricule),
    };
 
    this.isLoading.set(true);
    this.planService.createPlan(request).subscribe({
      next: (created) => {
        this.actionPlans.update(plans => [this.mapPlanResponse(created), ...plans]);
        this.isLoading.set(false);
        modal.dismiss();
        this.showToastMessage('✅ Plan créé avec succès');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showToastMessage(`❌ ${err.error?.message ?? 'Erreur lors de la création'}`);
      }
    });
  }
 
  deletePlan(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan?')) return;
    this.planService.deletePlan(id).subscribe({
      next:  () => { this.actionPlans.update(plans => plans.filter(p => p.id !== id)); this.showToastMessage('✅ Plan supprimé'); },
      error: (err) => this.showToastMessage(`❌ ${err.error?.message ?? 'Erreur suppression'}`)
    });
  }
 
  canDeletePlan(plan?: ActionPlan): boolean {
    const p = plan ?? this.selectedPlan();
    if (!p || p.estCloture) return false;
    const r = this.authService.getUserRole();
    if (r !== 'Pilot' && r !== 'Admin') return false;
    return p.matEmp === this.getCurrentMatricule();
  }
 
  validatePlan(): void {
    const plan = this.selectedPlan();
    if (!plan || !this.isPilotePrincipal()) return;
    this.planService.validerPlan(plan.id).subscribe({
      next: () => {
        const updated = { ...plan, status: 'Validé', visibility: 'Public' };
        this.selectedPlan.set(updated);
        this.actionPlans.update(plans => plans.map(p => p.id === plan.id ? updated : p));
        this.showToastMessage('✅ Plan validé et rendu public');
      },
      error: (err) => this.showToastMessage(`❌ ${err.error?.message ?? 'Erreur validation'}`)
    });
  }
 
  closePlan(): void {
    const plan = this.selectedPlan();
    if (!plan || !this.isPilotePrincipal()) return;
    if (!confirm('Clôturer ce plan ? Il sera archivé définitivement.')) return;
    this.planService.cloturerPlan(plan.id).subscribe({
      next: () => {
        this.viewMode.set('list');
        this.selectedPlan.set(null);
        this.loadPlans();
        this.showToastMessage('✅ Plan clôturé et archivé');
      },
      error: (err) => this.showToastMessage(`❌ ${err.error?.message ?? 'Erreur clôture'}`)
    });
  }
 
  isPlanClosed(): boolean {
    return this.selectedPlan()?.estCloture === true
        || this.selectedPlan()?.status === 'Clôturé';
  }
 
  // ── Co-pilots ─────────────────────────────────────────────────────────────
  addCoPilot(): void {
    const mat = Number(this.selectedCoPilotMatricule());
    if (!mat) return;
    const m = this.membresDisponibles().find(x => x.matricule === mat);
    if (m && !this.selectedCoPilots().find(x => x.matricule === mat))
      this.selectedCoPilots.update(list => [...list, m]);
    this.selectedCoPilotMatricule.set(null);
  }
 
  removeCoPilot(matricule: number): void {
    this.selectedCoPilots.update(list => list.filter(m => m.matricule !== matricule));
  }
 
  addRedacteur(): void {
    const mat = Number(this.selectedRedacteurMatricule());
    if (!mat) return;
    const m = this.membresDisponibles().find(x => x.matricule === mat);
    if (m && !this.selectedRedacteurs().find(x => x.matricule === mat))
      this.selectedRedacteurs.update(list => [...list, m]);
    this.selectedRedacteurMatricule.set(null);
  }
 
  removeRedacteur(matricule: number): void {
    this.selectedRedacteurs.update(list => list.filter(m => m.matricule !== matricule));
  }
 
  onTypeChange(): void {
    if (this.newPlan().type === 'Mono-Pilote') this.selectedCoPilots.set([]);
  }
 
  resetForm(): void {
    const services    = this.servicesList();
    const autoService = services.length === 1 ? services[0].code : null;   // ✅ int
    this.newPlan.set({ title: '', codeService: autoService, creationDate: this.getTodayDate(), type: 'Mono-Pilote', visibility: 'Public', categorie: null });
    this.selectedCoPilots.set([]);
    this.selectedRedacteurs.set([]);
    this.selectedCoPilotMatricule.set(null);
    this.selectedRedacteurMatricule.set(null);
  }
 
  // ── Navigation ────────────────────────────────────────────────────────────
  viewPlanDetails(plan: ActionPlan): void {
    this.selectedPlan.set(plan);
    this.viewMode.set('detail');
  }
 
  backToList(): void {
    this.viewMode.set('list');
    this.selectedPlan.set(null);
  }
 
  // ── Stats ─────────────────────────────────────────────────────────────────
  getTotalActions(): number       { return this.selectedPlan()?.totalActions     ?? 0; }
  getActionsInProgress(): number  { return this.selectedPlan()?.actionsEnCours   ?? 0; }
  getCompletedActions(): number   { return this.selectedPlan()?.actionsCloturees ?? 0; }
  getOverdueActions(): number     { return this.selectedPlan()?.actionsEnRetard  ?? 0; }
  getProgressPercentage(): number { return Math.round(this.selectedPlan()?.tauxAvencement ?? 0); }
 
  // ── Actions table ─────────────────────────────────────────────────────────
  deleteAction(actionId: number): void {
    if (!this.isPlanEditable()) return;
    if (!confirm('Supprimer cette action?')) return;
    const plan = this.selectedPlan(); if (!plan?.actions) return;
    const updated = { ...plan, actions: plan.actions.filter(a => a.id !== actionId) };
    this.selectedPlan.set(updated);
    this.actionPlans.update(plans => plans.map(p => p.id === plan.id ? updated : p));
  }
 
  getFilteredActions(): Action[] {
    const actions = this.selectedPlan()?.actions || [];
    const search  = this.searchTerm().toLowerCase();
    if (!search) return actions;
    return actions.filter(a =>
      a.theme.toLowerCase().includes(search) ||
      a.action.toLowerCase().includes(search) ||
      a.responsable.toLowerCase().includes(search)
    );
  }
 
  getPaginatedActions(): Action[] {
    const filtered = this.getFilteredActions();
    const start    = (this.currentPage() - 1) * this.rowsPerPage();
    return filtered.slice(start, start + this.rowsPerPage());
  }
 
  getTotalPages(): number {
    return Math.ceil(this.getFilteredActions().length / this.rowsPerPage());
  }
 
  openAddActionModal(): void {
    if (!this.isPlanEditable()) return;
    this.newAction.set({ theme: '', anomAmel: '', immeCorr: '', criticite: '', cause: '', action: '', responsable: '', delai: '', methodeEfficacite: '', commentaire: '' });
    this.formErrors.set({});
    this.showAddActionModal.set(true);
  }
 
  closeAddActionModal(): void { this.showAddActionModal.set(false); }
  addNewAction(): void { this.showToastMessage('⚠️ Ajout d\'actions disponible en Sprint 3'); }
  validateAddActionForm(): boolean { return true; }
 
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
    this.rejectionFormData.set({ titre: '', cause: '', responsable: '', delai: '' });
  }
 
  initiateActionClosure(): void { this.showClosureForm.set(true); }
 
  submitActionClosure(): void {
    const action = this.selectedActionDetail();
    if (!action) return;
    if (!this.hasUploadedFile()) { this.showToastMessage('⚠️ Veuillez uploader un fichier'); return; }
    action.dateRealisee = this.getTodayDate(); action.state = 'D';
    action.closureComment = this.actionClosureComment();
    action.methodeVerification = this.actionClosureMethod();
    action.dateVerification = this.actionClosureDate();
    if (!action.comments) action.comments = [];
    action.comments.push({ id: action.comments.length + 1, author: '', text: `Clôturée - ${this.actionClosureComment()}`, timestamp: new Date().toLocaleString('fr-FR'), type: 'state_change' });
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
    if (!this.hasUploadedFile()) { this.showToastMessage('⚠️ Veuillez uploader un fichier'); return; }
    action.state = 'C'; action.efficacyRating = this.efficacyRating();
    action.efficacite = this.getEfficacyLabel(this.efficacyRating());
    if (!action.comments) action.comments = [];
    action.comments.push({ id: action.comments.length + 1, author: '', text: `Vérifiée - Efficacité: ${action.efficacite}`, timestamp: new Date().toLocaleString('fr-FR'), type: 'state_change' });
    this.selectedActionDetail.set({ ...action });
    this.showToastMessage('Action Vérifiée ✅');
  }
 
  initiateRejection(): void { this.showRejectionForm.set(true); }
 
  submitRejection(): void {
    const action = this.selectedActionDetail();
    if (!action) return;
    action.isRejected = true; action.state = 'P';
    if (!action.comments) action.comments = [];
    action.comments.push({ id: action.comments.length + 1, author: '', text: 'Action rejetée', timestamp: new Date().toLocaleString('fr-FR'), type: 'rejection' });
    this.selectedActionDetail.set({ ...action });
    this.showRejectionForm.set(false);
    this.showToastMessage('Action rejetée');
  }
 
  cancelRejection(): void {
    this.showRejectionForm.set(false);
    this.rejectionFormData.set({ titre: '', cause: '', responsable: '', delai: '' });
  }
 
  addComment(text: string): void {
    const action = this.selectedActionDetail();
    if (!action || !text.trim()) return;
    if (!action.comments) action.comments = [];
    action.comments.push({ id: action.comments.length + 1, author: '', text, timestamp: new Date().toLocaleString('fr-FR'), type: 'comment' });
    this.selectedActionDetail.set({ ...action });
  }
 
  exportToCSV(): void {
    const plan = this.selectedPlan();
    if (!plan?.actions) return;
    const headers = ['Rédacteur', 'N°', 'Thème', 'DATE', 'ANOM/AMÉL', 'IMME/CORR', 'Criticité', 'Cause', 'Action', 'Responsable', 'Délai'];
    const rows = plan.actions.map(a => [a.redacteur, a.id, a.theme, a.date, a.anomAmel, a.immeCorr, a.criticite, a.cause, a.action, a.responsable, a.delai]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `plan-${plan.id}-actions.csv`; a.click();
    window.URL.revokeObjectURL(url);
  }
 
  showToastMessage(message: string): void {
    this.toastMessage.set(message); this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }
 
  getEfficacyLabel(r: number): string { return ['', 'Faible', 'Moyen', 'Bon', 'Excellent'][r] || ''; }
  getEfficacyEmoji(r: number): string { return ['', '😞', '😐', '😊', '✅'][r] || ''; }
 
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.fileDescription().trim()) {
      this.uploadedFiles.update(files => [...files, { name: file.name, description: this.fileDescription(), date: new Date().toLocaleDateString('fr-FR') }]);
      this.hasUploadedFile.set(true); this.fileDescription.set(''); event.target.value = '';
      this.showToastMessage(`Fichier "${file.name}" uploadé avec succès`);
    } else if (!this.fileDescription().trim()) {
      this.showToastMessage('Veuillez ajouter une description');
    }
  }
 
  saveVerificationData(): void {
    const action = this.selectedActionDetail();
    if (!action) return;
    if (!action.dateVerification || !action.methodeVerification) { this.showToastMessage('Veuillez remplir tous les champs'); return; }
    if (!action.comments) action.comments = [];
    action.comments.push({ id: action.comments.length + 1, author: '', text: `Vérification enregistrée`, timestamp: new Date().toLocaleString('fr-FR'), type: 'state_change' });
    this.selectedActionDetail.set({ ...action });
    this.showToastMessage('Données de vérification enregistrées');
  }
 
  openDocumentsModal(): void  { this.showDocumentsModal.set(true); }
  closeDocumentsModal(): void { this.showDocumentsModal.set(false); }
 
  getTodayDate(): string {
    const t = new Date();
    return `${String(t.getDate()).padStart(2, '0')}/${String(t.getMonth() + 1).padStart(2, '0')}/${t.getFullYear()}`;
  }
 
  startEditingCell(actionId: number, field: string, currentValue: string): void {
    if (!this.isPlanEditable()) return;
    this.editingCell.set({ actionId, field });
    this.editingValue.set(currentValue || '');
  }
 
  saveEditingCell(): void {
    const editing = this.editingCell(); if (!editing) return;
    const plan = this.selectedPlan(); if (!plan?.actions) return;
    const action = plan.actions.find(a => a.id === editing.actionId); if (!action) return;
    (action as any)[editing.field] = this.editingValue();
    this.selectedPlan.set({ ...plan });
    this.actionPlans.update(plans => plans.map(p => p.id === plan.id ? plan : p));
    this.editingCell.set(null); this.editingValue.set('');
  }
 
  cancelEditingCell(): void { this.editingCell.set(null); this.editingValue.set(''); }
 
  isEditingCell(actionId: number, field: string): boolean {
    const e = this.editingCell();
    return e?.actionId === actionId && e?.field === field;
  }
}