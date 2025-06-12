import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { tap, catchError, map } from 'rxjs/operators';
import { Login } from '../models/login.model';
import { UserStoreService } from '../helpers/user-store.service';
import { AuthUser } from '../models/auth-user';
import { jwtDecode } from 'jwt-decode';

interface BackendLoginResponse {
  accessToken: string;
  message: string;
}

interface DecodedJwt {
  sub: string; // User ID
  username: string;
  isAdmin: boolean;
  exp: number;
  iat: number;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userBaseUrl = "http://localhost:8080/api/user";
  private adminBaseUrl = "http://localhost:8080/api/admin";

  constructor(private http: HttpClient, private userStore: UserStoreService) { }

  // Modified to take an optional role, or determine endpoint by some other means
  // For now, this component is simplified for user registration via /api/user/register
  // If admin registration via UI is needed, it would typically be a separate flow/component
  // that calls /api/admin/register.
  register(user: User): Observable<{id: number, message: string}> {
    const payload = {
      username: user.username,
      email: user.email,
      password: user.password
    };
    // This registration method is for general users.
    // Admin registration would be handled by a specific admin interface/service method
    // calling the admin registration endpoint.
    const registrationUrl = `${this.userBaseUrl}/register`;

    return this.http.post<{id: number, message: string}>(registrationUrl, payload).pipe(
      tap(response => {
        console.log("User registered successfully via user endpoint", response);
      })
      // CatchError can be handled by the component for better user feedback
    );
  }

  // Admin registration method - if needed by an admin UI feature
  registerAdmin(user: User): Observable<{id: number, message: string}> {
    const payload = {
      username: user.username,
      email: user.email,
      password: user.password
    };
    const registrationUrl = `${this.adminBaseUrl}/register`;
    return this.http.post<{id: number, message: string}>(registrationUrl, payload).pipe(
      tap(response => {
        console.log("Admin registered successfully via admin endpoint", response);
      })
    );
  }


  login(credentials: Login): Observable<AuthUser> {
    // Backend determines role based on credentials.
    // If successful, JWT will contain isAdmin claim.
    // We assume a combined login endpoint or that the user/admin login distinction
    // is handled by which form they use (e.g. /login vs /admin/login on frontend if distinct)
    // For now, this method hits the general user login.
    // If your backend strategy implies distinct login endpoints, adjust this.
    // The current backend has /api/user/login and /api/admin/login.
    // This method implies it could be for either. The `credentials` object doesn't specify role.
    // Let's assume this is for USER login for now. If ADMIN login is needed, create loginAdmin().

    // To handle both, we could add a flag to Login model or have separate methods.
    // For simplicity with current code, let's assume this is for users.
    // If you need admin login, create a `loginAdmin` method.
    let loginUrl = `${this.userBaseUrl}/login`;

    // Example: If a property like `attemptAsAdmin` existed on Login model:
    // if (credentials.attemptAsAdmin) { loginUrl = `${this.adminBaseUrl}/login`; }
    // Or, check username pattern if admins have specific usernames, though less secure.

    // Given the AdminController has /api/admin/login, it's better to have separate login methods in AuthService
    // or pass a role hint. For now, this is user login.
    return this.http.post<BackendLoginResponse>(loginUrl, credentials).pipe(
      map(response => this.processLoginResponse(response)),
      catchError(err => {
        console.error("Login Error in AuthService:", err);
        this.userStore.setUser(null);
        return throwError(() => new Error(err.error?.message || err.error?.error || 'Login failed'));
      })
    );
  }

  // Specific login for Admin
  loginAdmin(credentials: Login): Observable<AuthUser> {
    const loginUrl = `${this.adminBaseUrl}/login`;
    return this.http.post<BackendLoginResponse>(loginUrl, credentials).pipe(
      map(response => this.processLoginResponse(response)),
      catchError(err => {
        console.error("Admin Login Error in AuthService:", err);
        this.userStore.setUser(null);
        return throwError(() => new Error(err.error?.message || err.error?.error || 'Admin login failed'));
      })
    );
  }

  private processLoginResponse(response: BackendLoginResponse): AuthUser {
    const decodedToken = jwtDecode<DecodedJwt>(response.accessToken);
    const authUser: AuthUser = {
      jwtToken: response.accessToken,
      userId: parseInt(decodedToken.sub, 10),
      username: decodedToken.username,
      name: decodedToken.username, 
      role: decodedToken.isAdmin ? 'ADMIN' : 'USER'
    };
    return authUser; // Component calling login/loginAdmin will set this in userStore
  }


 refreshToken(): Observable<AuthUser> {
     // The refresh endpoint needs to be chosen based on current user's context if they differ.
     // Backend refresh logic in UserController and AdminController is identical (uses JWT claims).
     // So /api/user/refresh should work for both if token is valid.
     let refreshUrl = `${this.userBaseUrl}/refresh`;
     const currentRole = this.userStore.authUser?.role;
     if (currentRole === 'ADMIN') {
        // Technically, either refresh endpoint would work if the JWTService can re-issue tokens
        // based on the claims from *any* valid refresh token.
        // Using admin's refresh path for an admin for clarity, though /user/refresh might also work.
        refreshUrl = `${this.adminBaseUrl}/refresh`;
     }


     return this.http.post<BackendLoginResponse>(refreshUrl, {}).pipe(
         map(response => {
             const decodedToken = jwtDecode<DecodedJwt>(response.accessToken);
             const authUser: AuthUser = {
                 jwtToken: response.accessToken,
                 userId: parseInt(decodedToken.sub, 10),
                 username: decodedToken.username,
                 name: decodedToken.username,
                 role: decodedToken.isAdmin ? 'ADMIN' : 'USER'
             };
             this.userStore.setUser(authUser);
             return authUser;
         }),
         catchError(err => {
             console.error("Token refresh Error in AuthService:", err);
             this.logout();
             return throwError(() => new Error(err.error?.message || err.error?.error || 'Token refresh failed'));
         })
     );
 }


  logout(): void {
    const role = this.userStore.authUser?.role;
    let logoutUrl = `${this.userBaseUrl}/logout`;
    if (role === 'ADMIN') {
        logoutUrl = `${this.adminBaseUrl}/logout`;
    }
    // Backend logout clears the HttpOnly refresh token cookie.
    // The subscription here is just to ensure the call is made.
    this.http.post(logoutUrl, {}, {responseType: 'text'}).subscribe({
        next: () => console.log('Logout call to backend successful.'),
        error: (err) => console.error('Backend logout call failed but clearing client state.', err)
    });
    this.userStore.setUser(null); // Clear client-side user state
  }

  isAuthenticated(): boolean {
    return this.userStore.isLoggedIn();
  }

  isAdmin(): boolean {
    const authUser = this.userStore.authUser;
    return !!authUser && authUser.role === 'ADMIN';
  }

  getCurrentUserId(): number | undefined {
    return this.userStore.authUser?.userId;
  }

  getCurrentUserName(): string | undefined {
    return this.userStore.authUser?.name;
  }
}