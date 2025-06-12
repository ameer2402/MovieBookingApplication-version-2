import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserStoreService } from '../helpers/user-store.service';

export const authGuard: CanActivateFn = ( // Ensure this is exported
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userStore = inject(UserStoreService);
  const router = inject(Router);

  if (!userStore.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data['role'] as string;
  if (requiredRole) {
    const userRole = userStore.authUser?.role;
    if (userRole !== requiredRole) {
      router.navigate(['/error']);
      return false;
    }
  }
  return true;
};

// NO "export class AuthGuard ..." HERE ANYMORE