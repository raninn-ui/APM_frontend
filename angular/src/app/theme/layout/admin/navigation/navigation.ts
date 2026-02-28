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
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/analytics',
        icon: 'feather icon-home'
      }
    ]
  },
  {
    id: 'action-plans',
    title: 'Mes plans d\'action',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'action-plans-list',
        title: 'Plans d\'action',
        type: 'item',
        url: '/action-plans',
        classes: 'nav-item',
        icon: 'feather icon-check-square'
      },
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
      }
    ]
  },
  {
    id: 'statistiques-group',
    title: 'Statistiques',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'statistiques',
        title: 'Statistiques',
        type: 'item',
        url: '/statistiques',
        icon: 'feather icon-pie-chart',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'parametres',
    title: 'Paramètres',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'parametres-collapse',
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
    ]
  },
  {
    id: 'ui-component',
    title: 'Ui Component',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'basic',
        title: 'Component',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/component/button'
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/component/badges'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumb & Pagination',
            type: 'item',
            url: '/component/breadcrumb-paging'
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/component/collapse'
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/component/tabs-pills'
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/component/typography'
          }
        ]
      }
    ]
  },
  {
    id: 'chart',
    title: 'Chart',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'apexchart',
        title: 'ApexChart',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      }
    ]
  },
  {
    id: 'forms & tables',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'forms',
        title: 'Basic Forms',
        type: 'item',
        url: '/forms',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'tables',
        title: 'Tables',
        type: 'item',
        url: '/tables',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'menu-level',
        title: 'Menu Levels',
        type: 'collapse',
        icon: 'feather icon-menu',
        children: [
          {
            id: 'menu-level-2.1',
            title: 'Menu Level 2.1',
            type: 'item',
            url: 'javascript:',
            external: true
          },
          {
            id: 'menu-level-2.2',
            title: 'Menu Level 2.2',
            type: 'collapse',
            children: [
              {
                id: 'menu-level-2.2.1',
                title: 'Menu Level 2.2.1',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-2.2.2',
                title: 'Menu Level 2.2.2',
                type: 'item',
                url: 'javascript:',
                external: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'Authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'signup',
        title: 'Sign up',
        type: 'item',
        url: '/register',
        icon: 'feather icon-at-sign',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'signin',
        title: 'Sign in',
        type: 'item',
        url: '/login',
        icon: 'feather icon-log-in',
        target: true,
        breadcrumbs: false
      }
    ]
  }
];
