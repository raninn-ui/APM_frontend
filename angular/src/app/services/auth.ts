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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly authApiUrl = `${environment.apiUrl}/api/auth`;
  private readonly rolePriority: UserRole[] = ['Admin', 'Pilot', 'Responsable', 'Consultant', 'Redacteur'];

  // Signals for reactive state
  isLoggedIn = signal(this.hasToken());
  currentUser = signal<User | null>(this.getStoredUser());
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {
    // Check if user is already logged in on service initialization
    if (this.hasToken()) {
      this.isLoggedIn.set(true);
      const user = this.getStoredUser();
      if (user) {
        this.currentUser.set(user);
      }
    }
  }

  /**
   * Login with email and password
   * @param credentials - Email and password
   * @returns Observable of LoginResponse
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<ApiLoginResponse>(`${this.authApiUrl}/login`, credentials).pipe(
      map((response) => this.mapLoginResponse(response)),
      tap((response) => this.handleLoginSuccess(response)),
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
        id: String(response.user.id),
        email: response.user.email ?? '',
        name: [response.user.firstName, response.user.lastName].filter(Boolean).join(' ').trim() || response.user.username,
        role: this.getPrimaryRole(roles),
        roles
      }
    };
  }

  private mapRole(role: string): UserRole | null {
    switch (role.trim().toLowerCase()) {
      case 'administrateur':
        return 'Admin';
      case 'pilote':
        return 'Pilot';
      case 'responsable':
        return 'Responsable';
      case 'consultateur':
      case 'consultant':
        return 'Consultant';
      case 'rédacteur':
      case 'redacteur':
        return 'Redacteur';
      default:
        return null;
    }
  }

  private getPrimaryRole(roles: UserRole[]): UserRole | null {
    return this.rolePriority.find((role) => roles.includes(role)) ?? null;
  }

  /**
   * Handle successful login
   */
  private handleLoginSuccess(response: LoginResponse): void {
    this.saveToken(response.token);
    this.saveUser(response.user);
    this.isLoggedIn.set(true);
    this.currentUser.set(response.user);
    this.isLoading.set(false);
  }

  /**
   * Handle login error
   */
  private handleLoginError(error: HttpErrorResponse): Observable<never> {
    this.isLoading.set(false);
    const errorMessage = error.error?.message || 'Login failed. Please try again.';
    this.error.set(errorMessage);
    return throwError(() => error);
  }

  /**
   * Logout user
   */
  logout(): void {
    this.removeToken();
    this.removeUser();
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.error.set(null);
  }

  /**
   * Save token to localStorage
   */
  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Remove token from localStorage
   */
  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check if token exists
   */
  hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Save user to localStorage
   */
  private saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user from localStorage
   */
  getStoredUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    if (!user) {
      return null;
    }

    const parsedUser = JSON.parse(user) as Partial<User>;
    const roles = Array.isArray(parsedUser.roles)
      ? parsedUser.roles
      : parsedUser.role
        ? [parsedUser.role]
        : [];

    return {
      id: String(parsedUser.id ?? ''),
      email: parsedUser.email ?? '',
      name: parsedUser.name ?? '',
      role: this.getPrimaryRole(roles),
      roles
    };
  }

  /**
   * Remove user from localStorage
   */
  private removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  /**
   * Check if user is logged in
   */
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  /**
   * Get user role
   */
  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  getUserRoles(): UserRole[] {
    const user = this.getCurrentUser();
    return user ? user.roles : [];
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.getUserRoles().includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some((role) => userRoles.includes(role));
  }

  /**
   * Get permissions for current user role
   */
  getPermissions(): RolePermissions {
    const role = this.getUserRole();

    const defaultPermissions: RolePermissions = {
      canCreatePlans: false,
      canAssignActions: false,
      canViewStatistics: false,
      canValidateActions: false,
      canClosePlans: false,
      canViewOwnActions: false,
      canUpdateProgress: false,
      canCloseOwnActions: false,
      canUploadFiles: false,
      canAddComments: false,
      canViewPlans: false,
      canManageUsers: false
    };

    switch (role) {
      case 'Admin':
        return {
          ...defaultPermissions,
          canManageUsers: true,
          canViewPlans: true,
          canViewStatistics: true
        };

      case 'Pilot':
        return {
          ...defaultPermissions,
          canCreatePlans: true,
          canAssignActions: true,
          canViewStatistics: true,
          canValidateActions: true,
          canClosePlans: true,
          canViewPlans: true
        };

      case 'Responsable':
        return {
          ...defaultPermissions,
          canViewOwnActions: true,
          canUpdateProgress: true,
          canCloseOwnActions: true,
          canUploadFiles: true,
          canAddComments: true
        };

      case 'Consultant':
        return {
          ...defaultPermissions,
          canViewPlans: true,
          canViewStatistics: true
        };

      case 'Redacteur':
        return {
          ...defaultPermissions,
          canAssignActions: true,
          canViewStatistics: true,
          canValidateActions: true,
          canViewPlans: true
        };

      default:
        return defaultPermissions;
    }
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: keyof RolePermissions): boolean {
    return this.getPermissions()[permission];
  }

  /**
   * Get redirect URL based on user role
   * Used after successful login to redirect to appropriate dashboard
   */
  getRedirectUrlByRole(): string {
    const role = this.getUserRole();

    switch (role) {
      case 'Admin':
        // Admin goes to administration panel
        return '/parametres/administration';

      case 'Pilot':
        // Pilot goes to their plans
        return '/mes-plans';

      case 'Responsable':
        // Responsable goes to their assigned actions
        return '/mes-actions';

      case 'Consultant':
        // Consultant goes to statistics (read-only)
        return '/statistiques';

      case 'Redacteur':
        // Redacteur goes to plans where they can create actions
        return '/mes-plans';

      default:
        // Default fallback
        return '/plans-usine';
    }
  }
}
