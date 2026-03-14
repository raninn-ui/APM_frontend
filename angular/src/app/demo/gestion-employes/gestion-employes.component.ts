import { Component, signal, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';

interface Employee {
  id: number;
  matricule: number;
  nom: string;
  prenom: string;
  email: string;
  responsabilite: string;
  serviceLib: string;
  typeAcces: string;
  sessionWindows: string;
}

@Component({
  selector: 'app-gestion-employes',
  standalone: true,
  imports: [SharedModule, CommonModule, FormsModule],
  templateUrl: './gestion-employes.component.html',
  styleUrls: ['./gestion-employes.component.scss']
})
export class GestionEmployesComponent {
  private modalService = inject(NgbModal);
  private router = inject(Router);
  private http = inject(HttpClient);

  apiUrl = 'http://localhost:5128/api';

  searchTerm = '';
  employees = signal<Employee[]>([]);
  filteredEmployees = signal<Employee[]>([]);

  newEmployee = signal({
    nom: '',
    prenom: '',
    email: '',
    responsabilite: '',
    service: '',
    motDePasse: ''
  });

  responsabilites: any[] = [];
  services: any[] = [];

  ngOnInit() {
    this.loadDropdownData();
    this.loadEmployees();
  }

  goToDetails(matricule: number) {
    this.router.navigate(['/parametres/administration/' + matricule]);
  }

  loadEmployees() {
    this.http.get<any[]>(`${this.apiUrl}/employees/full`).subscribe({
      next: (data) => {
        this.employees.set(data.map((emp: any) => ({
          id: emp.matricule,
          matricule: emp.matricule,
          nom: emp.nom,
          prenom: emp.prenom,
          email: emp.email,
          responsabilite: emp.responsableName || 'Aucun',
          serviceLib: emp.serviceLibs?.join(', ') || 'Aucun',
          typeAcces: emp.roles.join(', '),
          sessionWindows: emp.compteWin || ''
        })));
        this.filteredEmployees.set(this.employees());
      },
      error: (err) => console.error('Load employees error', err)
    });
  }

  loadDropdownData() {
    this.http.get<any[]>(`${this.apiUrl}/employees/full`).subscribe(emps => {
      this.responsabilites = emps.map(e => ({ id: e.matricule, name: e.nom + ' ' + e.prenom }));
    });

    this.http.get<any[]>(`${this.apiUrl}/employees/services`).subscribe(svcs => {
      this.services = svcs.map(s => ({ code: s.code, lib: s.lib }));
    });
  }

  filterEmployees(event: any): void {
    const val = event.target.value.toLowerCase();
    const filtered = this.employees().filter(emp =>
      emp.nom?.toLowerCase().includes(val) ||
      emp.prenom?.toLowerCase().includes(val) ||
      emp.matricule?.toString().includes(val)
    );
    this.filteredEmployees.set(filtered);
  }

  openAddModal(content: TemplateRef<any>): void {
    this.resetForm();
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  async addEmployee(modal: any): Promise<void> {
    const emp = this.newEmployee();
    if (emp.nom.trim() && emp.prenom.trim() && emp.email.trim()) {
      const payload = {
        Nom: emp.nom,
        Prenom: emp.prenom,
        Email: emp.email,
        Responsable: parseInt(emp.responsabilite) || null,
        ServiceCode: emp.service || null,
        MotDePasse: emp.motDePasse
      };
      try {
        await this.http.post(`${this.apiUrl}/employees`, payload).toPromise();
        this.loadEmployees();
        this.resetForm();
        modal.dismiss();
        alert('Employé ajouté!');
      } catch (error: any) {
        console.error('Add employee error', error);
        alert(`Erreur ajout: status=${error.status} message=${error.error ? JSON.stringify(error.error) : error.message}`);
      }
    }
  }

  deleteEmployee(id: number): void {
    if (confirm('Confirmer suppression employé ' + id + ' ?')) {
      this.http.delete(`${this.apiUrl}/employees/${id}`).subscribe({
        next: () => this.loadEmployees(),
        error: (err) => {
          console.error('Delete error', err);
          alert('Erreur suppression');
        }
      });
    }
  }

  resetForm(): void {
    this.newEmployee.set({
      nom: '',
      prenom: '',
      email: '',
      responsabilite: '',
      service: '',
      motDePasse: ''
    });
  }
}