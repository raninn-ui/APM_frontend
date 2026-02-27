// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

interface ServiceItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-plans-usine',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './plans-usine.component.html',
  styleUrls: ['./plans-usine.component.scss']
})
export class PlansUsineComponent {
  private router = inject(Router);

  // List of services for the factory
  services: ServiceItem[] = [
    { id: 'ressources-materielles', name: 'Gérer les ressources Materielles', icon: 'feather icon-box', color: 'primary' },
    { id: 'piloter-centre', name: 'Piloter le centre', icon: 'feather icon-target', color: 'success' },
    { id: 'systeme-info', name: 'Gérer les sysyteme D\'information', icon: 'feather icon-monitor', color: 'info' },
    { id: 'commercialiser', name: 'Commercialiser', icon: 'feather icon-shopping-cart', color: 'warning' },
    { id: 'derogation', name: 'Dérogation', icon: 'feather icon-alert-triangle', color: 'danger' },
    { id: 'direction-admin', name: 'Direction Administrative et financiére', icon: 'feather icon-briefcase', color: 'secondary' },
    { id: 'ressources-humaines', name: 'Gérer Les Ressources Humaines', icon: 'feather icon-users', color: 'primary' },
    { id: 'systeme-ac', name: 'Systéme & AC', icon: 'feather icon-shield', color: 'success' },
    { id: 'fabriquer', name: 'Fabriquer', icon: 'feather icon-cpu', color: 'info' },
    { id: 'achats', name: 'Gérer Les Achats', icon: 'feather icon-shopping-bag', color: 'warning' },
    { id: 'industrialisation', name: 'Industrialisation', icon: 'feather icon-settings', color: 'danger' },
    { id: 'supply-chain', name: 'Gérer La Supply Chain', icon: 'feather icon-truck', color: 'secondary' }
  ];

  onServiceClick(service: ServiceItem): void {
    // Navigate to /mes-plans for all services
    this.router.navigate(['/mes-plans']);
  }
}
