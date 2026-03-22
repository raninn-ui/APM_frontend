import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole | null;
  roles: UserRole[];
}

export type UserRole = 'Admin' | 'Pilot' | 'Responsable' | 'Consultant' | 'Redacteur';

interface ApiLoginResponse {
  token: string;
  expiresAt: string;
  user: {
    id: number | string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    roles: string[];
  };
}

export interface RolePermissions {
  canCreatePlans: boolean;
  canAssignActions: boolean;
  canViewStatistics: boolean;
  canValidateActions: boolean;
  canClosePlans: boolean;
  canViewOwnActions: boolean;
  canUpdateProgress: boolean;
  canCloseOwnActions: boolean;
  canUploadFiles: boolean;
  canAddComments: boolean;
  canViewPlans: boolean;
  canManageUsers: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY   = 'auth_token';
  private readonly USER_KEY    = 'auth_user';
  private readonly authApiUrl  = `${environment.apiUrl}/api/auth`;
  private readonly rolePriority: UserRole[] = ['Admin', 'Pilot', 'Responsable', 'Consultant', 'Redacteur'];

  isLoggedIn  = signal(this.hasToken());
  currentUser = signal<User | null>(this.getStoredUser());
  isLoading   = signal(false);
  error       = signal<string | null>(null);

  constructor(private http: HttpClient) {
    if (this.hasToken()) {
      this.isLoggedIn.set(true);
      const user = this.getStoredUser();
      if (user) this.currentUser.set(user);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http.post<ApiLoginResponse>(`${this.authApiUrl}/login`, credentials).pipe(
      map((response) => this.mapLoginResponse(response)),
      tap((response) => this.handleLoginSuccess(response)),
      catchError((error) => this.handleLoginError(error))
    );
  }

  /**
   * ✅ Rafraîchit le token JWT avec les rôles actuels depuis la DB.
   * À appeler après un changement de rôles sur l'employé connecté.
   */
  refreshToken(): Observable<LoginResponse> {
    return this.http.post<ApiLoginResponse>(`${this.authApiUrl}/refresh-token`, {}).pipe(
      map((response) => this.mapLoginResponse(response)),
      tap((response) => {
        // Met à jour le token et l'utilisateur en mémoire + localStorage
        this.handleLoginSuccess(response);
      }),
      catchError((error) => this.handleLoginError(error))
    );
  }

  private mapLoginResponse(response: ApiLoginResponse): LoginResponse {
    const roles = (response.user.roles ?? [])
      .map((role) => this.mapRole(role))
      .filter((role): role is UserRole => role !== null);

    return {
      token: response.token,
      user: {
        id:    String(response.user.id),
        email: response.user.email ?? '',
        name:  [response.user.firstName, response.user.lastName].filter(Boolean).join(' ').trim() || response.user.username,
        role:  this.getPrimaryRole(roles),
        roles
      }
    };
  }

  private mapRole(role: string): UserRole | null {
    switch (role.trim().toLowerCase()) {
      case 'administrateur': return 'Admin';
      case 'pilote':         return 'Pilot';
      case 'responsable':    return 'Responsable';
      case 'consultateur':
      case 'consultant':     return 'Consultant';
      case 'rédacteur':
      case 'redacteur':      return 'Redacteur';
      default:               return null;
    }
  }

  private getPrimaryRole(roles: UserRole[]): UserRole | null {
    return this.rolePriority.find((role) => roles.includes(role)) ?? null;
  }

  private handleLoginSuccess(response: LoginResponse): void {
    this.saveToken(response.token);
    this.saveUser(response.user);
    this.isLoggedIn.set(true);
    this.currentUser.set(response.user);
    this.isLoading.set(false);
  }

  private handleLoginError(error: HttpErrorResponse): Observable<never> {
    this.isLoading.set(false);
    const errorMessage = error.error?.message || 'Login failed. Please try again.';
    this.error.set(errorMessage);
    return throwError(() => error);
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.error.set(null);
  }

  private saveToken(token: string): void   { localStorage.setItem(this.TOKEN_KEY, token); }
  getToken(): string | null                { return localStorage.getItem(this.TOKEN_KEY); }
  private removeToken(): void              { localStorage.removeItem(this.TOKEN_KEY); }
  hasToken(): boolean                      { return !!localStorage.getItem(this.TOKEN_KEY); }
  private saveUser(user: User): void       { localStorage.setItem(this.USER_KEY, JSON.stringify(user)); }
  private removeUser(): void               { localStorage.removeItem(this.USER_KEY); }

  getStoredUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    if (!user) return null;
    const parsedUser = JSON.parse(user) as Partial<User>;
    const roles = Array.isArray(parsedUser.roles)
      ? parsedUser.roles
      : parsedUser.role ? [parsedUser.role] : [];
    return {
      id:    String(parsedUser.id ?? ''),
      email: parsedUser.email ?? '',
      name:  parsedUser.name ?? '',
      role:  this.getPrimaryRole(roles),
      roles
    };
  }

  getCurrentUser(): User | null        { return this.currentUser(); }
  isAuthenticated(): boolean           { return this.isLoggedIn(); }
  getUserRole(): UserRole | null       { return this.getCurrentUser()?.role ?? null; }
  getUserRoles(): UserRole[]           { return this.getCurrentUser()?.roles ?? []; }
  hasRole(role: UserRole): boolean     { return this.getUserRoles().includes(role); }
  hasAnyRole(roles: UserRole[]): boolean { return roles.some(r => this.getUserRoles().includes(r)); }

  getPermissions(): RolePermissions {
    const role = this.getUserRole();
    const def: RolePermissions = {
      canCreatePlans: false, canAssignActions: false, canViewStatistics: false,
      canValidateActions: false, canClosePlans: false, canViewOwnActions: false,
      canUpdateProgress: false, canCloseOwnActions: false, canUploadFiles: false,
      canAddComments: false, canViewPlans: false, canManageUsers: false
    };
    switch (role) {
      case 'Admin':       return { ...def, canManageUsers: true, canViewPlans: true, canViewStatistics: true };
      case 'Pilot':       return { ...def, canCreatePlans: true, canAssignActions: true, canViewStatistics: true, canValidateActions: true, canClosePlans: true, canViewPlans: true };
      case 'Responsable': return { ...def, canViewOwnActions: true, canUpdateProgress: true, canCloseOwnActions: true, canUploadFiles: true, canAddComments: true };
      case 'Consultant':  return { ...def, canViewPlans: true, canViewStatistics: true };
      case 'Redacteur':   return { ...def, canAssignActions: true, canViewStatistics: true, canValidateActions: true, canViewPlans: true };
      default:            return def;
    }
  }

  hasPermission(permission: keyof RolePermissions): boolean {
    return this.getPermissions()[permission];
  }

  getRedirectUrlByRole(): string {
    switch (this.getUserRole()) {
      case 'Admin':       return '/parametres/gestion-employes';
      case 'Pilot':       return '/mes-plans';
      case 'Responsable': return '/mes-actions';
      case 'Consultant':  return '/statistiques';
      case 'Redacteur':   return '/mes-plans';
      default:            return '/plans-usine';
    }
  }
}