import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth';
import { catchError, throwError } from 'rxjs';

/**
 * HTTP Interceptor for Authentication
 * - Adds Bearer token to all requests
 * - Handles 401 errors (token expired)
 * - Redirects to login on authentication failure
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get token from auth service
  const token = authService.getToken();

  // Clone request and add Authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Token added to request:', req.url);
  } else {
    console.log('⚠️ No token found for request:', req.url);
  }

  // Handle response
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized (token expired or invalid)
      if (error.status === 401) {
        console.error('❌ 401 Unauthorized - Token expired or invalid');

        // Clear auth data
        authService.logout();

        // Redirect to login
        router.navigate(['/login']);

        // Show error message
        const errorMessage = error.error?.message || 'Votre session a expiré. Veuillez vous reconnecter.';
        console.error('Auth Error:', errorMessage);
      }

      // Handle 403 Forbidden (insufficient permissions)
      if (error.status === 403) {
        console.error('❌ 403 Forbidden - Insufficient permissions');
        const errorMessage = error.error?.message || 'Vous n\'avez pas les permissions nécessaires.';
        console.error('Permission Error:', errorMessage);
      }

      // Handle 500 Server Error
      if (error.status === 500) {
        console.error('❌ 500 Server Error');
        const errorMessage = error.error?.message || 'Erreur serveur. Veuillez réessayer plus tard.';
        console.error('Server Error:', errorMessage);
      }

      // Re-throw error for component to handle
      return throwError(() => error);
    })
  );
};
