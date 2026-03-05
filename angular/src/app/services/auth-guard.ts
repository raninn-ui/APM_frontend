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
    console.warn('❌ Access denied - User not authenticated');
    console.warn('Redirecting to /login');
    router.navigate(['/login']);
    return false;
  }

  console.log('✅ User is authenticated');

  // Check if route requires specific role
  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = authService.getUserRole();

    if (!userRole || !requiredRoles.includes(userRole)) {
      console.warn('❌ Access denied - Insufficient permissions');
      console.warn('Required roles:', requiredRoles);
      console.warn('User role:', userRole);

      // Redirect to unauthorized page
      router.navigate(['/unauthorized']);
      return false;
    }

    console.log('✅ User has required role:', userRole);
  }

  // Check if route requires specific permission
  const requiredPermission = route.data['permission'] as string | undefined;

  if (requiredPermission) {
    const hasPermission = authService.hasPermission(requiredPermission as any);

    if (!hasPermission) {
      console.warn('❌ Access denied - Missing permission:', requiredPermission);
      router.navigate(['/unauthorized']);
      return false;
    }

    console.log('✅ User has permission:', requiredPermission);
  }

  return true;
};
