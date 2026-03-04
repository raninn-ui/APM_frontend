import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
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
    role: 'Admin' | 'Pilot' | 'Responsable' | 'Consultateur' | 'Redacteur';
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Pilot' | 'Responsable' | 'Consultateur' | 'Redacteur';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly API_URL = 'http://localhost:3000/api/auth'; // TODO: Change to your API URL

  // Signals for reactive state
  isLoggedIn = signal(this.hasToken());
  currentUser = signal<User | null>(this.getStoredUser());
  isLoading = signal(false);
  error = signal<string | null>(null);

  // BehaviorSubject for backward compatibility
  private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public user$ = this.userSubject.asObservable();

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

    // TODO: Replace with actual API call when Personne A provides the endpoint
    // return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
    //   tap(response => this.handleLoginSuccess(response)),
    //   catchError(error => this.handleLoginError(error))
    // );

    // Mock API response for now
    const mockResponse: LoginResponse = {
      token: 'mock_token_' + Date.now(),
      user: {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        role: 'Redacteur' as const
      }
    };

    return of(mockResponse).pipe(
      tap(response => this.handleLoginSuccess(response)),
      catchError(error => this.handleLoginError(error))
    );
  }

  /**
   * Handle successful login
   */
  private handleLoginSuccess(response: LoginResponse): void {
    this.saveToken(response.token);
    this.saveUser(response.user);
    this.isLoggedIn.set(true);
    this.currentUser.set(response.user);
    this.userSubject.next(response.user);
    this.isLoading.set(false);
    console.log('Login successful:', response.user);
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
    this.userSubject.next(null);
    this.error.set(null);
    console.log('User logged out');
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
  getUserRole(): 'Admin' | 'Pilot' | 'Responsable' | 'Consultateur' | 'Redacteur' |null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: 'Admin' | 'Pilot' | 'Responsable' | 'Consultateur' | 'Redacteur'): boolean {
    return this.getUserRole() === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: ('Admin' | 'Pilot' | 'Responsable' | 'Consultateur' | 'Redacteur')[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }
}
