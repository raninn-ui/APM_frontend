// angular import
import { Component, signal, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

interface Employee {
  id: number;
  matricule: number;
  nom: string;
  prenom: string;
  email: string;
  responsabilite: string;
  service: string;
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

  // Search term
  searchTerm = '';

  // Employee being edited
  editingEmployee = signal<Employee | null>(null);

  // List of employees
  employees = signal<Employee[]>([
    { id: 1, matricule: 1, nom: 'Benali', prenom: 'Ahmed', email: 'ahmed.benali@apm.com', responsabilite: 'Pilote', service: 'Qualité', typeAcces: 'Admin', sessionWindows: 'g1' },
    { id: 2, matricule: 2, nom: 'Mansouri', prenom: 'Fatima', email: 'fatima.mansouri@apm.com', responsabilite: 'Rédacteur', service: 'RH', typeAcces: 'User', sessionWindows: 'g2' },
    { id: 3, matricule: 3, nom: 'Karim', prenom: 'Mohamed', email: 'mohamed.karim@apm.com', responsabilite: 'Pilote', service: 'Production', typeAcces: 'Admin', sessionWindows: 'g3' },
    { id: 4, matricule: 4, nom: 'Saidani', prenom: 'Nadia', email: 'nadia.saidani@apm.com', responsabilite: 'Rédacteur', service: 'Finance', typeAcces: 'User', sessionWindows: 'g4' },
    { id: 5, matricule: 5, nom: 'Amrani', prenom: 'Youssef', email: 'youssef.amrani@apm.com', responsabilite: 'Pilote', service: 'IT', typeAcces: 'Admin', sessionWindows: 'g5' }
  ]);

  // Filtered employees based on search
  filteredEmployees = signal<Employee[]>([]);

  // New employee form data
  newEmployee = signal({
    matricule: null as number | null,
    nom: '',
    prenom: '',
    email: '',
    responsabilite: '',
    service: '',
    typeAcces: '',
    sessionWindows: ''
  });

  // Options for dropdowns
  responsabilites = ['Pilote', 'Rédacteur', 'Responsable', 'Admin', 'Autre'];
  services = ['Qualité', 'RH', 'Finance', 'Production', 'IT', 'Maintenance', 'Achats', 'Commercial'];
  typeAccesOptions = ['Admin', 'User', 'Guest'];

  constructor() {
    this.filteredEmployees.set(this.employees());
  }

  // Search employees by matricule
  searchEmployees(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredEmployees.set(this.employees());
    } else {
      const searchNum = parseInt(this.searchTerm);
      const filtered = this.employees().filter(emp => 
        emp.matricule === searchNum
      );
      this.filteredEmployees.set(filtered);
    }
  }

  // Generate session windows based on matricule
  generateSessionWindows(matricule: number): string {
    return 'g' + matricule;
  }

  // Open add employee modal
  openAddModal(content: TemplateRef<any>): void {
    this.resetForm();
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  // Open edit employee modal
  openEditModal(content: TemplateRef<any>, employee: Employee): void {
    this.editingEmployee.set({...employee});
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  // Add new employee
  addEmployee(modal: any): void {
    const emp = this.newEmployee();
    if (emp.matricule && emp.nom.trim() && emp.prenom.trim() && emp.email.trim()) {
      const newEmp: Employee = {
        id: Math.max(...this.employees().map(e => e.id), 0) + 1,
        matricule: emp.matricule,
        nom: emp.nom,
        prenom: emp.prenom,
        email: emp.email,
        responsabilite: emp.responsabilite,
        service: emp.service,
        typeAcces: emp.typeAcces,
        sessionWindows: this.generateSessionWindows(emp.matricule)
      };

      this.employees.update(emps => [...emps, newEmp]);
      this.searchEmployees();
      this.resetForm();
      modal.dismiss();
    }
  }

  // Update employee (only responsabilite, service, typeAcces)
  updateEmployee(modal: any): void {
    const emp = this.editingEmployee();
    if (emp) {
      this.employees.update(emps => 
        emps.map(e => e.id === emp.id ? emp : e)
      );
      this.searchEmployees();
      this.editingEmployee.set(null);
      modal.dismiss();
    }
  }

  // Delete employee
  deleteEmployee(id: number): void {
    this.employees.update(emps => emps.filter(e => e.id !== id));
    this.searchEmployees();
  }

  // Reset form
  resetForm(): void {
    this.newEmployee.set({
      matricule: null,
      nom: '',
      prenom: '',
      email: '',
      responsabilite: '',
      service: '',
      typeAcces: '',
      sessionWindows: ''
    });
  }
}
