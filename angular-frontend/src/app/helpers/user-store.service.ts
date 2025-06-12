import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUser } from '../models/auth-user'; // Ensure this path is correct

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  user$: Observable<AuthUser | null> = this.userSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        this.userSubject.next(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user from localStorage", e);
        localStorage.removeItem('authUser');
      }
    }
  }

  setUser(user: AuthUser | null): void {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
    this.userSubject.next(user);
  }

  get authUser(): AuthUser | null {
    return this.userSubject.getValue();
  }

  // Method to directly get user ID
  getCurrentUserId(): number | undefined {
    return this.authUser?.userId;
  }

  isLoggedIn(): boolean {
    return !!this.authUser;
  }
}