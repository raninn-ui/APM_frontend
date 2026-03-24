import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { AuthService } from 'src/app/services/auth';


@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  apiUrl = 'http://localhost:5128/api';

  matricule = signal<number>(0);
  employeeInfo = signal<any>({});
  editableEmployee = signal<any>({ Nom: '', Prenom: '', Email: '', Responsable: null });
  availableRoles = signal<any[]>([]);
  assignedRoles = signal<any[]>([]);
  selectedAvailableRole = signal<any>(null);
  selectedAssignedRole = signal<any>(null);
  employeesForDropdown = signal<any[]>([]);
  servicesForDropdown = signal<any[]>([]);
  selectedServices = signal<string[]>([]);
  selectedServiceTags = computed(() => this.servicesForDropdown().filter(s => this.selectedServices().includes(s.code)));
  serviceLabels = computed(() =>
    this.selectedServiceTags().length > 0
      ? this.selectedServiceTags().map(s => s.lib).join(', ')
      : 'Aucun'
  );
  allEmployees = signal<any[]>([]);
  searchTerm = signal('');
  filteredSearch = computed(() => this.allEmployees().filter(emp =>
    emp.nom.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
    emp.prenom.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
    emp.matricule.toString().includes(this.searchTerm())
  ));


  ngOnInit(): void {
    const mat = Number(this.route.snapshot.paramMap.get('matricule'));
    this.matricule.set(mat);
    this.loadDropdowns(mat);
  }

  loadDropdowns(mat: number): void {
    this.http.get<any[]>(`${this.apiUrl}/employees/full`).subscribe(employees => {
      this.employeesForDropdown.set(employees.map(e => ({ id: e.matricule, name: e.nom + ' ' + e.prenom })));
      this.allEmployees.set(employees);
      const emp = employees.find(e => e.matricule === mat);
      if (emp) {
        this.employeeInfo.set({
          matricule: emp.matricule,
          nom: emp.nom,
          prenom: emp.prenom,
          responsable: emp.responsableName || 'Aucun',
          email: emp.email,
          compteWin: emp.compteWin
        });
        this.editableEmployee.set({
          Nom: emp.nom,
          Prenom: emp.prenom,
          Email: emp.email,
          Responsable: emp.responsableMatricule || null
        });
        const currentCodes = emp.serviceCodes || [];
        this.selectedServices.set(currentCodes);
      }
    });

    this.http.get<any[]>(`${this.apiUrl}/employees/services`).subscribe(services => {
      this.servicesForDropdown.set(services);
    });

    this.http.get<any[]>(`${this.apiUrl}/employees/roles`).subscribe(roles => {
      this.http.get<number[]>(`${this.apiUrl}/employees/${mat}/roles`).subscribe(assignedIds => {
        this.assignedRoles.set(roles.filter(r => assignedIds.includes(r.id)));
        this.availableRoles.set(roles.filter(r => !assignedIds.includes(r.id)));
      });
    });
  }

  moveToAssigned(): void {
    const s = this.selectedAvailableRole();
    if (s) {
      this.assignedRoles.update(r => [...r, s]);
      this.availableRoles.update(r => r.filter(x => x.id !== s.id));
      this.selectedAvailableRole.set(null);
    }
  }

  moveToAvailable(): void {
    const s = this.selectedAssignedRole();
    if (s) {
      this.availableRoles.update(r => [...r, s]);
      this.assignedRoles.update(r => r.filter(x => x.id !== s.id));
      this.selectedAssignedRole.set(null);
    }
  }

  selectAvailableRole(role: any): void {
    this.selectedAvailableRole.set(role);
    this.selectedAssignedRole.set(null);
  }

  selectAssignedRole(role: any): void {
    this.selectedAssignedRole.set(role);
    this.selectedAvailableRole.set(null);
  }

  toggleService(code: string): void {
    const current = this.selectedServices();
    if (current.includes(code)) {
      this.selectedServices.set(current.filter(c => c !== code));
    } else {
      this.selectedServices.set([...current, code]);
    }
  }

  saveAccessRights(): void {
    const ids = this.assignedRoles().map(r => r.id);
    this.http.put(`${this.apiUrl}/employees/${this.matricule()}/roles`, ids).subscribe({
      next: () => {
        const currentMatricule = parseInt(this.authService.getCurrentUser()?.id ?? '0', 10);
        if (this.matricule() === currentMatricule) {
          // Current user's roles changed → refresh token silently
          this.authService.refreshToken().subscribe({
            next: () => alert('Droits enregistrés et session mise à jour!'),
            error: () => alert('Droits enregistrés — reconnectez-vous pour appliquer les changements')
          });
        } else {
          alert('Droits enregistrés!');
        }
      },
      error: (err) => alert('Erreur: ' + JSON.stringify(err.error))
    });
  }

  navigateToEmployee(mat: number): void {
    window.location.href = `/parametres/administration/${mat}`;
  }

  updateEmployee(): void {
    this.http.put(`${this.apiUrl}/employees/${this.matricule()}`, this.editableEmployee()).subscribe({
      next: () => {
        this.http.put(`${this.apiUrl}/employees/${this.matricule()}/services`, this.selectedServices()).subscribe({
          next: () => alert('Mis à jour!'),
          error: (err) => alert('Erreur services: ' + JSON.stringify(err.error))
        });
      },
      error: (err) => alert('Erreur: ' + JSON.stringify(err.error))
    });
  }
}