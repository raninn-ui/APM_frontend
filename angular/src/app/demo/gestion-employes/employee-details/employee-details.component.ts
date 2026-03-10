import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// project import
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

interface EmployeeInfo {
  matricule: string;
  nom: string;
  prenom: string;
  responsable: string;
  email: string;
  windowsAccount: string;
}

interface EditableEmployee {
  nom: string;
  prenom: string;
  responsable: string;
  sessionWindows: string;
  email: string;
}

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent {
  // Employee information (dummy data)
  employeeInfo = signal<EmployeeInfo>({
    matricule: '544025',
    nom: 'ABIDI',
    prenom: 'JEZIA',
    responsable: 'FATMA BEN NEJI',
    email: 'example@email.com',
    windowsAccount: 'G544025'
  });

  // Editable employee form data
  editableEmployee = signal<EditableEmployee>({
    nom: 'ABIDI',
    prenom: 'JEZIA',
    responsable: 'FATMA BEN NEJI',
    sessionWindows: 'G544025',
    email: 'example@email.com'
  });

  // Available roles (left list)
  availableRoles = signal<string[]>([
    'Admin',
    'Consultation confidentiel',
    'Statistique',
    'Directeur',
    'Création PDCA confidentiel',
    'Développeur',
    'Recevoir mail de relance',
    'Création PDCA collective',
    'Modérateur',
    'Suivi Actions'
  ]);

  // Assigned roles (right list)
  assignedRoles = signal<string[]>([
    'Pilote',
    'Responsable',
    'Consultation',
    'Rédacteur'
  ]);

  // Selected items in lists
  selectedAvailableRole = signal<string | null>(null);
  selectedAssignedRole = signal<string | null>(null);

  // Options for responsable dropdown
  responsables = [
    'FATMA BEN NEJI',
    'ALI BEN AHMED',
    'MOHAMED BEN SALAH',
    'SAMI BEN KHALIFA',
    'NOUREDDINE BEN AMOR'
  ];

  // Move role from available to assigned
  moveToAssigned(): void {
    const selectedRole = this.selectedAvailableRole();
    if (selectedRole) {
      this.assignedRoles.update(roles => [...roles, selectedRole]);
      this.availableRoles.update(roles => roles.filter(r => r !== selectedRole));
      this.selectedAvailableRole.set(null);
    }
  }

  // Move role from assigned to available
  moveToAvailable(): void {
    const selectedRole = this.selectedAssignedRole();
    if (selectedRole) {
      this.availableRoles.update(roles => [...roles, selectedRole]);
      this.assignedRoles.update(roles => roles.filter(r => r !== selectedRole));
      this.selectedAssignedRole.set(null);
    }
  }

  // Select a role from available list
  selectAvailableRole(role: string): void {
    this.selectedAvailableRole.set(role);
    this.selectedAssignedRole.set(null);
  }

  // Select a role from assigned list
  selectAssignedRole(role: string): void {
    this.selectedAssignedRole.set(role);
    this.selectedAvailableRole.set(null);
  }

  // Save access rights
  saveAccessRights(): void {
    console.log('Saving access rights:', {
      available: this.availableRoles(),
      assigned: this.assignedRoles()
    });
    // UI only - no backend logic
    alert('Droits d\'accès enregistrés avec succès!');
  }

  // Update employee information
  updateEmployee(): void {
    const emp = this.editableEmployee();
    
    // Update the employee info display
    this.employeeInfo.update(info => ({
      ...info,
      nom: emp.nom,
      prenom: emp.prenom,
      responsable: emp.responsable,
      email: emp.email,
      windowsAccount: emp.sessionWindows
    }));
    
    // UI only - no backend logic
    alert('Informations employée mises à jour avec succès!');
  }
}

