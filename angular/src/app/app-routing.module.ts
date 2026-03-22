import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { authGuard } from './services/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: '/analytics', pathMatch: 'full' },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component').then(c => c.DashAnalyticsComponent)
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then(m => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart-maps/core-apex.component').then(c => c.CoreApexComponent)
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms/form-elements/form-elements.component').then(c => c.FormElementsComponent)
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/tables/tbl-bootstrap/tbl-bootstrap.component').then(c => c.TblBootstrapComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component').then(c => c.SamplePageComponent)
      },

      // ── Plans Usine — services grid ───────────────────────────────────────
      {
        path: 'plans-usine',
        loadComponent: () => import('./demo/plans-usine/plans-usine.component').then(c => c.PlansUsineComponent),
        canActivate: [authGuard]
      },
      // Dynamic route: /plans-usine/SRV001, /plans-usine/SRV002, etc.
      // Service codes come from DB — no hardcoded paths needed
      {
        path: 'plans-usine/:serviceCode',
        loadComponent: () => import('./demo/action-plans/action-plans.component').then(c => c.ActionPlansComponent),
        canActivate: [authGuard]
      },

      // ── Mes Plans ─────────────────────────────────────────────────────────
      {
        path: 'mes-plans',
        loadComponent: () => import('./demo/action-plans/action-plans.component').then(c => c.ActionPlansComponent),
        canActivate: [authGuard],
        data: { roles: ['Pilot', 'Redacteur'] }
      },

      // ── Mes Actions ───────────────────────────────────────────────────────
      {
        path: 'mes-actions',
        loadComponent: () => import('./demo/mes-actions/mes-actions.component').then(c => c.MesActionsComponent),
        canActivate: [authGuard],
        data: { roles: ['Responsable'] }
      },

      // ── Suivi Actions ─────────────────────────────────────────────────────
      {
        path: 'suivi-actions',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component').then(c => c.DashAnalyticsComponent),
        canActivate: [authGuard],
        data: { roles: ['Pilot', 'Admin'] }
      },

      // ── Statistiques ──────────────────────────────────────────────────────
      {
        path: 'statistiques',
        loadComponent: () => import('./demo/statistiques/statistiques.component').then(c => c.StatistiquesComponent),
        canActivate: [authGuard],
        data: { roles: ['Admin', 'Pilot', 'Consultant', 'Redacteur'] },
        children: [
          { path: '', redirectTo: 'mensuel', pathMatch: 'full' },
          { path: 'mensuel',                  loadComponent: () => import('./demo/statistiques/stat-mensuel/stat-mensuel.component').then(c => c.StatMensuelComponent) },
          { path: 'actions-par-service',      loadComponent: () => import('./demo/statistiques/stat-actions-service/stat-actions-service.component').then(c => c.StatActionsServiceComponent) },
          { path: 'usine',                    loadComponent: () => import('./demo/statistiques/stat-usine/stat-usine.component').then(c => c.StatUsineComponent) },
          { path: 'responsables',             loadComponent: () => import('./demo/statistiques/stat-responsables/stat-responsables.component').then(c => c.StatResponsablesComponent) },
          { path: 'pilotes-par-service',      loadComponent: () => import('./demo/statistiques/stat-pilotes-service/stat-pilotes-service.component').then(c => c.StatPilotesServiceComponent) },
          { path: 'efficacites-employes',     loadComponent: () => import('./demo/statistiques/stat-efficacites-employes/stat-efficacites-employes.component').then(c => c.StatEfficacitesEmployesComponent) },
          { path: 'actions-employes',         loadComponent: () => import('./demo/statistiques/stat-actions-employes/stat-actions-employes.component').then(c => c.StatActionsEmployesComponent) },
          { path: 'verification',             loadComponent: () => import('./demo/other/sample-page/sample-page.component').then(c => c.SamplePageComponent) },
          { path: 'responsables-verification',loadComponent: () => import('./demo/other/sample-page/sample-page.component').then(c => c.SamplePageComponent) }
        ]
      },

      // ── Paramètres ────────────────────────────────────────────────────────
      {
        path: 'parametres',
        canActivate: [authGuard],
        data: { roles: ['Admin'] },
        children: [
          { path: '', redirectTo: 'gestion-employes', pathMatch: 'full' },
          { path: 'gestion-employes',           loadComponent: () => import('./demo/gestion-employes/gestion-employes.component').then(c => c.GestionEmployesComponent) },
          { path: 'administration',             loadComponent: () => import('./demo/gestion-employes/employee-details/employee-details.component').then(c => c.EmployeeDetailsComponent) },
          { path: 'administration/:matricule',  loadComponent: () => import('./demo/gestion-employes/employee-details/employee-details.component').then(c => c.EmployeeDetailsComponent) }
        ]
      },

      {
        path: 'aide',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component').then(c => c.SamplePageComponent)
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      { path: 'register',        loadComponent: () => import('./demo/pages/authentication/sign-up/sign-up.component').then(c => c.SignUpComponent) },
      { path: 'login',           loadComponent: () => import('./demo/pages/authentication/sign-in/sign-in.component').then(c => c.SignInComponent) },
      { path: 'forgot-password', loadComponent: () => import('./demo/pages/authentication/forgot-password/forgot-password').then(c => c.ForgotPassword) },
      { path: 'unauthorized',    loadComponent: () => import('./demo/pages/authentication/unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
