// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/analytics',
        pathMatch: 'full'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component').then((c) => c.DashAnalyticsComponent)
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart-maps/core-apex.component').then((c) => c.CoreApexComponent)
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms/form-elements/form-elements.component').then((c) => c.FormElementsComponent)
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/tables/tbl-bootstrap/tbl-bootstrap.component').then((c) => c.TblBootstrapComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      {
        path: 'action-plans',
        loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
      },
      {
        path: 'plans-usine',
        loadComponent: () => import('./demo/plans-usine/plans-usine.component').then((c) => c.PlansUsineComponent),
        children: [
          {
            path: '',
            redirectTo: 'ressources-materielles',
            pathMatch: 'full'
          },
          {
            path: 'ressources-materielles',
            loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
          },
          {
            path: 'piloter-centre',
            loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
          },
          {
            path: 'systeme-info',
            loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
          },
          {
            path: 'commercialiser',
            loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
          },
          {
            path: 'derogation',
            loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
          },
          {
            path: 'direction-admin',
            loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
          },
          {
            path: 'ressources-humaines',
            loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
          },
          {
            path: 'systeme-ac',
            loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
          },
          {
            path: 'fabriquer',
            loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
          },
          {
            path: 'achats',
            loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
          },
          {
            path: 'industrialisation',
            loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
          },
          {
            path: 'supply-chain',
            loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
          }
        ]
      },
      {
        path: 'mes-plans',
        loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
      },
      {
        path: 'mes-actions',
        loadComponent: () => import('./demo/action-plans/action-plans.component').then((c) => c.ActionPlansComponent)
      },
      {
        path: 'suivi-actions',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component').then((c) => c.DashAnalyticsComponent)
      },
      {
        path: 'statistiques',
        loadComponent: () => import('./demo/statistiques/statistiques.component').then((c) => c.StatistiquesComponent),
        children: [
          {
            path: '',
            redirectTo: 'mensuel',
            pathMatch: 'full'
          },
          {
            path: 'mensuel',
            loadComponent: () => import('./demo/statistiques/stat-mensuel/stat-mensuel.component').then((c) => c.StatMensuelComponent)
          },
          {
            path: 'actions-par-service',
            loadComponent: () => import('./demo/statistiques/stat-actions-service/stat-actions-service.component').then((c) => c.StatActionsServiceComponent)
          },
          {
            path: 'usine',
            loadComponent: () => import('./demo/statistiques/stat-usine/stat-usine.component').then((c) => c.StatUsineComponent)
          },
          {
            path: 'responsables',
            loadComponent: () => import('./demo/statistiques/stat-responsables/stat-responsables.component').then((c) => c.StatResponsablesComponent)
          },
          {
            path: 'pilotes-par-service',
            loadComponent: () => import('./demo/statistiques/stat-pilotes-service/stat-pilotes-service.component').then((c) => c.StatPilotesServiceComponent)
          },
          {
            path: 'efficacites-employes',
            loadComponent: () => import('./demo/statistiques/stat-efficacites-employes/stat-efficacites-employes.component').then((c) => c.StatEfficacitesEmployesComponent)
          },
          {
            path: 'actions-employes',
            loadComponent: () => import('./demo/statistiques/stat-actions-employes/stat-actions-employes.component').then((c) => c.StatActionsEmployesComponent)
          },
          {
            path: 'verification',
            loadComponent: () => import('./demo/other/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
          },
          {
            path: 'responsables-verification',
            loadComponent: () => import('./demo/other/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
          }
        ]
      },
      {
        path: 'parametres',
        children: [
          {
            path: '',
            redirectTo: 'administration',
            pathMatch: 'full'
          },
          {
            path: 'administration',
            loadComponent: () => import('./demo/other/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
          },
          {
            path: 'gestion-employes',
            loadComponent: () => import('./demo/gestion-employes/gestion-employes.component').then((c) => c.GestionEmployesComponent)
          }
        ]
      },
      {
        path: 'aide',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/sign-up/sign-up.component').then((c) => c.SignUpComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/sign-in/sign-in.component').then((c) => c.SignInComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
