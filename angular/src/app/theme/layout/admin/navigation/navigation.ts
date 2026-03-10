export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
  roles?: string[]; // Roles that can see this menu item
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'plans-usine',
    title: 'Plans d\'Action Usine',
    type: 'item',
    url: '/plans-usine',
    icon: 'feather icon-briefcase',
    classes: 'nav-item',
    roles: ['Admin', 'Pilot', 'Responsable', 'Consultant', 'Redacteur'] // Visible to all
  },
  {
    id: 'mes-plans',
    title: 'Mes Plans d\'Action',
    type: 'item',
    url: '/mes-plans',
    icon: 'feather icon-list',
    classes: 'nav-item',
    roles: ['Pilot', 'Redacteur'] // Only Pilot and Redacteur can create/manage plans
  },
  {
    id: 'mes-actions',
    title: 'Mes Actions',
    type: 'item',
    url: '/mes-actions',
    icon: 'feather icon-check-square',
    classes: 'nav-item',
    roles: ['Responsable'] // Only Responsable manages their assigned actions
  },
  {
    id: 'suivi-actions',
    title: 'Suivi Actions',
    type: 'item',
    url: '/suivi-actions',
    icon: 'feather icon-activity',
    classes: 'nav-item',
    roles: ['Pilot', 'Admin'] // Pilot and Admin can follow actions
  },
  {
    id: 'statistiques',
    title: 'Statistiques',
    type: 'item',
    url: '/statistiques',
    icon: 'feather icon-pie-chart',
    classes: 'nav-item',
    roles: ['Admin', 'Pilot', 'Consultant', 'Redacteur'] // All except Responsable
  },
  {
    id: 'parametres',
    title: 'Paramètres',
    type: 'collapse',
    icon: 'feather icon-settings',
    classes: 'nav-item',
    roles: ['Admin'], // Only Admin can access settings
    children: [
      {
        id: 'administration',
        title: 'Administration',
        type: 'item',
        url: '/parametres/administration',
        icon: 'feather icon-shield',
        classes: 'nav-item',
        roles: ['Admin']
      },
      {
        id: 'gestion-employes',
        title: 'Gestion des employés',
        type: 'item',
        url: '/parametres/gestion-employes',
        icon: 'feather icon-users',
        classes: 'nav-item',
        roles: ['Admin']
      }
    ]
  },
  {
    id: 'aide',
    title: 'Aide',
    type: 'item',
    url: '/aide',
    icon: 'feather icon-help-circle',
    classes: 'nav-item',
    roles: ['Admin', 'Pilot', 'Responsable', 'Consultant', 'Redacteur'] // Visible to all
  }
];
