import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserStoreService } from '../../helpers/user-store.service';
import { Login } from '../../models/login.model'; // Ensure path is correct
import { AuthService } from '../../services/auth.service'; // Ensure path is correct
import { AuthUser } from '../../models/auth-user'; // Ensure path is correct

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  loginModel: Login = new Login('', ''); // For ngModel binding

  constructor(
    private authService: AuthService,
    private router: Router,
    private userStore: UserStoreService
  ) { }

  ngOnInit(): void {
     if(this.authService.isAuthenticated()){
         this.redirectBasedOnRole(); // Redirect if already logged in
     }
  }

  login(form: NgForm): void {
    if (form.valid) {
      this.authService.login(this.loginModel).subscribe({
        next: (authUser: AuthUser) => {
          this.userStore.setUser(authUser);
          console.log('Logged in user:', authUser);
          this.redirectBasedOnRole();
        },
        error: (err) => {
          this.errorMessage = err.message || "Invalid Credentials or server error.";
          console.error("Login Error", err);
          this.userStore.setUser(null);
        }
      });
    } else {
      this.errorMessage = "Please fill in all required fields.";
    }
  }

  private redirectBasedOnRole(): void {
    const role = this.userStore.authUser?.role;
    console.log('Redirecting based on role:', role);
    if (role === 'ADMIN') {
      this.router.navigate(['/admin/view/events']); // Updated path
    } else if (role === 'USER') {
      this.router.navigate(['/user/view/events']); // Updated path
    } else {
      this.router.navigate(['/']);
      console.warn('User has no role or unexpected role, redirecting to home.');
    }
  }
}