import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ServiceService, ServiceItem, ServiceItemFull } from 'src/app/services/service.service';
import { AuthService } from 'src/app/services/auth';

const CARD_STYLES = [
  { icon: 'feather icon-award',        color: 'primary'   },
  { icon: 'feather icon-cpu',          color: 'success'   },
  { icon: 'feather icon-tool',         color: 'info'      },
  { icon: 'feather icon-users',        color: 'warning'   },
  { icon: 'feather icon-monitor',      color: 'danger'    },
  { icon: 'feather icon-briefcase',    color: 'secondary' },
  { icon: 'feather icon-settings',     color: 'primary'   },
  { icon: 'feather icon-shield',       color: 'success'   },
  { icon: 'feather icon-shopping-bag', color: 'info'      },
  { icon: 'feather icon-truck',        color: 'warning'   },
  { icon: 'feather icon-target',       color: 'danger'    },
  { icon: 'feather icon-box',          color: 'secondary' },
];

interface ServiceCard extends ServiceItem {
  icon: string;
  color: string;
}

@Component({
  selector: 'app-plans-usine',
  standalone: true,
  imports: [SharedModule, CommonModule, ReactiveFormsModule],
  templateUrl: './plans-usine.component.html',
  styleUrls: ['./plans-usine.component.scss']
})
export class PlansUsineComponent implements OnInit {
  private router         = inject(Router);
  private serviceService = inject(ServiceService);
  private fb             = inject(FormBuilder);
  private authService    = inject(AuthService);

  services     = signal<ServiceCard[]>([]);
  isLoading    = signal(false);
  errorMessage = signal<string | null>(null);

  showCrudPanel = signal(false);
  allServices   = signal<ServiceItemFull[]>([]);
  crudLoading   = signal(false);
  crudError     = signal<string | null>(null);
  crudSuccess   = signal<string | null>(null);

  showModal    = signal(false);
  isEditing    = signal(false);
  editingCode  = signal<number | null>(null);   // ✅ int
  modalLoading = signal(false);
  modalError   = signal<string | null>(null);

  deleteTarget  = signal<ServiceItemFull | null>(null);
  deleteLoading = signal(false);

  serviceForm!: FormGroup;

  ngOnInit(): void {
    this.buildForm();
    this.loadActiveServices();
  }

  private buildForm(): void {
    this.serviceForm = this.fb.group({
      lib:               ['', [Validators.required, Validators.maxLength(100)]],
      dateDesactivation: [null]
    });
  }

  loadActiveServices(): void {
    this.isLoading.set(true);
    this.serviceService.getActiveServices().subscribe({
      next: (items) => {
        this.services.set(items.map((s, i) => ({
          ...s,
          icon:  CARD_STYLES[i % CARD_STYLES.length].icon,
          color: CARD_STYLES[i % CARD_STYLES.length].color,
        })));
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les services');
        this.isLoading.set(false);
      }
    });
  }

  onServiceClick(service: ServiceCard): void {
    this.router.navigate(['/plans-usine', service.code], {
      queryParams: { serviceLib: service.lib }
    });
  }

  openCrudPanel(): void {
    this.showCrudPanel.set(true);
    this.loadAllServices();
  }

  closeCrudPanel(): void {
    this.showCrudPanel.set(false);
    this.crudError.set(null);
    this.crudSuccess.set(null);
  }

  loadAllServices(): void {
    this.crudLoading.set(true);
    this.crudError.set(null);
    this.serviceService.getAllServices().subscribe({
      next: (items) => { this.allServices.set(items); this.crudLoading.set(false); },
      error: () => { this.crudError.set('Impossible de charger les services.'); this.crudLoading.set(false); }
    });
  }

  isActive(s: ServiceItemFull): boolean {
    return !s.dateDesactivation || new Date(s.dateDesactivation) > new Date();
  }

  /** Bouton "Gérer les services" visible seulement pour les Admins */
  isAdmin(): boolean {
    const role = this.authService.getUserRole();
    return role === 'Admin';
  }

  openAddModal(): void {
    this.isEditing.set(false);
    this.editingCode.set(null);
    this.serviceForm.reset();
    this.modalError.set(null);
    this.showModal.set(true);
  }

  openEditModal(service: ServiceItemFull): void {
    this.isEditing.set(true);
    this.editingCode.set(service.code);   // ✅ int
    this.serviceForm.patchValue({
      lib:               service.lib,
      dateDesactivation: service.dateDesactivation ? service.dateDesactivation.substring(0, 10) : null
    });
    this.modalError.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.modalError.set(null);
  }

  submitForm(): void {
    if (this.serviceForm.invalid) return;
    this.modalLoading.set(true);
    this.modalError.set(null);
    const raw = this.serviceForm.getRawValue();

    if (this.isEditing()) {
      this.serviceService.updateService(this.editingCode()!, {
        lib: raw.lib,
        dateDesactivation: raw.dateDesactivation || null
      }).subscribe({
        next: () => { this.modalLoading.set(false); this.showModal.set(false); this.crudSuccess.set('Service modifié avec succès.'); this.refreshAll(); },
        error: (err) => { this.modalLoading.set(false); this.modalError.set(err.error?.message || 'Erreur lors de la modification.'); }
      });
    } else {
      this.serviceService.createService({
        lib: raw.lib,
        dateDesactivation: raw.dateDesactivation || null
      }).subscribe({
        next: () => { this.modalLoading.set(false); this.showModal.set(false); this.crudSuccess.set('Service ajouté avec succès.'); this.refreshAll(); },
        error: (err) => { this.modalLoading.set(false); this.modalError.set(err.error?.message || 'Erreur lors de la création.'); }
      });
    }
  }

  confirmDelete(service: ServiceItemFull): void { this.deleteTarget.set(service); }
  cancelDelete(): void { this.deleteTarget.set(null); }

  executeDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.deleteLoading.set(true);
    this.serviceService.deleteService(target.code).subscribe({   // ✅ int
      next: () => { this.deleteLoading.set(false); this.deleteTarget.set(null); this.crudSuccess.set('Service supprimé avec succès.'); this.refreshAll(); },
      error: (err) => { this.deleteLoading.set(false); this.deleteTarget.set(null); this.crudError.set(err.error?.message || 'Erreur lors de la suppression.'); }
    });
  }

  private refreshAll(): void {
    this.loadAllServices();
    this.serviceService.clearCache();
    this.loadActiveServices();
    setTimeout(() => this.crudSuccess.set(null), 4000);
  }
}