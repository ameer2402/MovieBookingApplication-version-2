import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registration.html',
  styleUrls: ['./registration.css']
})
export class RegistrationComponent {
  errorMessage: string = '';
  successMessage: string = '';

  // To determine if it's an admin registration attempt (can be set by a route parameter or a checkbox if needed)
  // For simplicity, we assume registration path /register is for users.
  // Admin registration would typically be a separate, protected path or functionality.
  // If user.userRole was used to determine the endpoint in AuthService, that logic remains.
  // Since we removed userRole from User model, AuthService now uses different endpoints based on a flag.
  // This component, as is, will register a regular USER.
  // If you need admin registration via UI, it requires more setup (e.g. separate component/route or a flag).

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  register(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.valid) {
      if (form.value.password !== form.value.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      // Create User object without mobileNumber and userRole
      const userData = new User(
        form.value.email,
        form.value.password,
        form.value.username
      );

      // Defaulting to USER registration.
      // If admin registration needed from this form, a flag would be required.
      // For now, AuthService's register method needs to know if it's admin or user.
      // Let's assume the authService.register method takes a role or the backend determines it.
      // The current backend differentiates by endpoint (/api/user/register vs /api/admin/register).
      // So, AuthService needs to call the correct endpoint.
      // Let's modify AuthService register to take a role, or have two methods: registerUser, registerAdmin.
      // For now, I'll assume this form always registers a 'USER'.
      // If the intent was for this form to also handle ADMIN role selection, then
      // AuthService.register needs to be adapted or use a specific admin registration method.
      // To align with current backend, we can pass role to AuthService.
      // For simplicity, this form registers as USER. Admin reg is via /api/admin/register.
      // The `User` model passed to authService.register doesn't have `userRole` anymore.
      // The `authService.register` method needs to be called correctly.

      // Updated: AuthService's register method has been simplified to not rely on userRole from model.
      // It chooses endpoint based on `user.userRole` if present.
      // Since it's removed from `User` model, we need to adjust how `authService.register` is called
      // or how it determines the URL.
      // For this component, it's always a 'USER' type registration.
      // The AuthService should reflect this or have separate methods.
      // For current structure, authService.register should handle this.
      // The provided authService.register was:
      // if (user.userRole === 'ADMIN') { registrationUrl = `${this.adminBaseUrl}/register`; }
      // This dependency on user.userRole needs to be removed from authService or user model needs role back.
      // Let's modify authService.register to take an explicit role or have separate methods.
      // Easiest is to add a role parameter to User constructor for this temporary purpose.
      // No, let's assume the backend API structure itself dictates the role.
      // /api/user/register -> USER
      // /api/admin/register -> ADMIN
      // So, if this form is for users, authService.register will call user endpoint.
      // The `User` model has `username, email, password`.
      // The `authService.register` method already expects a User object.
      // The provided `AuthService` in the prompt for `register(user: User)` does:
      // let registrationUrl = `${this.userBaseUrl}/register`;
      // if (user.userRole === 'ADMIN') { registrationUrl = `${this.adminBaseUrl}/register`;}
      // Since `user.userRole` is removed from `User` model, this logic in AuthService will default to user.
      // This is fine for this `RegistrationComponent` which is for general users.

      this.authService.register(userData).subscribe({
        next: (response) => { // Backend sends {id, message}
          this.successMessage = response.message + ' Redirecting to login...';
          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          if (err.error && typeof err.error.message === 'string') { // Backend sends {id, message} for error too
            this.errorMessage = err.error.message;
          } else if (err.error && typeof err.error === 'string') { // Older style error
             this.errorMessage = err.error;
          }
          else {
            this.errorMessage = 'Registration failed. Please try again or contact support.';
          }
          console.error('Registration error', err);
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Please ensure all fields are correctly filled and valid.';
    }
  }
}