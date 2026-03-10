import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'Admin' | 'Pilot' | 'Responsable' | 'Consultant' | 'Redacteur';
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Pilot' | 'Responsable' | 'Consultant' | 'Redacteur';
}

export type UserRole = 'Admin' | 'Pilot' | 'Responsable' | 'Consultant' | 'Redacteur';

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

    const role = this.getRoleByEmail(credentials.email);

    const mockResponse: LoginResponse = {
      token: 'mock_token_' + Date.now(),
      user: {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        role: role
      }
    };

    return of(mockResponse).pipe(
      tap(response => this.handleLoginSuccess(response)),
      catchError(error => this.handleLoginError(error))
    );
  }

  /**
   * Determine user role based on email (for testing)
   * In production, this will be provided by the backend
   *
   * Test Accounts:
   * - admin@example.com → Admin
   * - pilot@example.com → Pilot
   * - responsable@example.com → Responsable
   * - consultant@example.com → Consultant
   * - redacteur@example.com → Redacteur
   */
  private getRoleByEmail(email: string): UserRole {
    const emailLower = email.toLowerCase().trim();

    // Admin account
    if (emailLower === 'admin@example.com') {
      return 'Admin';
    }

    // Pilot account
    if (emailLower === 'pilot@example.com') {
      return 'Pilot';
    }

    // Responsable account
    if (emailLower === 'responsable@example.com') {
      return 'Responsable';
    }

    // Consultant account
    if (emailLower === 'consultant@example.com') {
      return 'Consultant';
    }

    // Redacteur account (default)
    if (emailLower === 'redacteur@example.com') {
      return 'Redacteur';
    }

    // Default role for any other email
    return 'Redacteur';
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
  private handleLoginError(error: any): Observable<never> {
    this.isLoading.set(false);
    const errorMessage = error?.error?.message || 'Login failed. Please try again.';
    this.error.set(errorMessage);
    console.error('Login error:', errorMessage);
    throw error;
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
    return user ? JSON.parse(user) : null;
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

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.getUserRole() === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
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
