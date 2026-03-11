import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';

/**
 * Auth Guard - Protects routes from unauthorized access
 * - Checks if user is authenticated (has token)
 * - Checks if user has required role (if specified in route data)
 * - Redirects to login if not authenticated
 * - Redirects to unauthorized page if insufficient permissions
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Check if route requires specific role
  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (requiredRoles && requiredRoles.length > 0) {
    if (!authService.hasAnyRole(requiredRoles as any)) {
      router.navigate(['/unauthorized']);
      return false;
    }
  }

  // Check if route requires specific permission
  const requiredPermission = route.data['permission'] as string | undefined;

  if (requiredPermission) {
    const hasPermission = authService.hasPermission(requiredPermission as any);

    if (!hasPermission) {
      router.navigate(['/unauthorized']);
      return false;
    }
  }

  return true;
};
