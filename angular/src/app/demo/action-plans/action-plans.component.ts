// angular import
import { Component, signal, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

interface Employee {
  id: number;
  name: string;
  role: 'Pilote' | 'Rédacteur' | 'Autre';
}

interface ActionPlan {
  id: number;
  title: string;
  pilots: string[]; // Changed to array to support multiple pilots
  process: string;
  creationDate: string;
  type: 'Mono-Pilote' | 'Multi-Pilote';
}

@Component({
  selector: 'app-action-plans',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './action-plans.component.html',
  styleUrls: ['./action-plans.component.scss']
})
export class ActionPlansComponent {
  private modalService = inject(NgbModal);

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

  actionPlans = signal<ActionPlan[]>([
    {
      id: 1,
      title: 'Améliorer la performance',
      pilots: ['GRITL Walid'],
      process: 'Gestion des Opérations',
      creationDate: '15/02/2026',
      type: 'Mono-Pilote'
    },
    {
      id: 2,
      title: 'Mise à jour de la documentation',
      pilots: ['GRITL Walid', 'Ahmed Benali', 'Fatima Zahra'],
      process: 'Gestion de la Qualité',
      creationDate: '10/02/2026',
      type: 'Multi-Pilote'
    },
    {
      id: 3,
      title: 'Formation de l\'équipe',
      pilots: ['GRITL Walid'],
      process: 'Gestion des Ressources Humaines',
      creationDate: '05/02/2026',
      type: 'Mono-Pilote'
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

  getTodayDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

