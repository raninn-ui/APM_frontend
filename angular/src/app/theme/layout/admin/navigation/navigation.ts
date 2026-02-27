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
}
  
export const NavigationItems: NavigationItem[] = [
  {
    id: 'plans-usine',
    title: 'Plans d\'Action Usine',
    type: 'item',
    url: '/plans-usine',
    icon: 'feather icon-briefcase',
    classes: 'nav-item'
  },
  {
    id: 'mes-plans',
    title: 'Mes Plans d\'Action',
    type: 'item',
    url: '/mes-plans',
    icon: 'feather icon-list',
    classes: 'nav-item'
  },
  {
    id: 'mes-actions',
    title: 'Mes Actions',
    type: 'item',
    url: '/mes-actions',
    icon: 'feather icon-check-square',
    classes: 'nav-item'
  },
  {
    id: 'suivi-actions',
    title: 'Suivi Actions',
    type: 'item',
    url: '/suivi-actions',
    icon: 'feather icon-activity',
    classes: 'nav-item'
  },
  {
    id: 'statistiques',
    title: 'Statistiques',
    type: 'item',
    url: '/statistiques',
    icon: 'feather icon-pie-chart',
    classes: 'nav-item'
  },
  {
    id: 'parametres',
    title: 'Paramètres',
    type: 'collapse',
    icon: 'feather icon-settings',
    classes: 'nav-item',
    children: [
      {
        id: 'administration',
        title: 'Administration',
        type: 'item',
        url: '/parametres/administration',
        icon: 'feather icon-shield',
        classes: 'nav-item'
      },
      {
        id: 'gestion-employes',
        title: 'Gestion des employés',
        type: 'item',
        url: '/parametres/gestion-employes',
        icon: 'feather icon-users',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'aide',
    title: 'Aide',
    type: 'item',
    url: '/aide',
    icon: 'feather icon-help-circle',
    classes: 'nav-item'
  }
];
