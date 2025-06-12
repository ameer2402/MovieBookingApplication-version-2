import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { UserStoreService } from '../../helpers/user-store.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { AdminNavComponent } from '../admin-nav/admin-nav';
import { UserNavComponent } from '../user-nav/user-nav';
import { AuthUser } from '../../models/auth-user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, // Add FormsModule
    AdminNavComponent,
    UserNavComponent
],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  showLogoutPopup = false;
  isLoggedIn = false;
  userRole: string | null = null;
  username: string | null = null;
  
  isMenuOpen: boolean = false; 
  isProfileDropdownOpen: boolean = false;

  searchTerm: string = ''; // For the search bar

  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userStore.user$.subscribe((user: AuthUser | null) => {
      this.updateUserState(user);
    });
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const target = event.target as HTMLElement;
    // Close profile dropdown if click is outside
    if (this.isProfileDropdownOpen && target && !target.closest('.profile-dropdown-container')) {
      this.closeProfileDropdown();
    }
    // Close mobile menu if click is outside of menu toggle and nav links (more complex for full coverage)
    // For simplicity, menu usually closes on navigation or explicit toggle.
  }


  private updateUserState(user: AuthUser | null): void {
    this.isLoggedIn = !!user;
    if (user) {
      this.username = user.name;
      this.userRole = user.role;
    } else {
      this.username = null;
      this.userRole = null;
    }
  }

  performSearch(): void {
    if (this.searchTerm.trim()) {
      // For now, just log or navigate to a conceptual search results page
      console.log('Searching for:', this.searchTerm);
      // Example navigation:
      // this.router.navigate(['/search-results'], { queryParams: { q: this.searchTerm } });
      this.closeMenu(); // Close mobile menu after search
      alert(`Search initiated for: "${this.searchTerm}". \n(Full search functionality not yet implemented.)`);
      this.searchTerm = ''; // Clear search term after "search"
    }
  }

  logout(): void {
    this.authService.logout(); // This handles clearing userStore and backend call
    this.showLogoutPopup = false; // Hide popup
    this.closeMenu(); 
    this.closeProfileDropdown();
    this.router.navigate(['/login']); // Navigate after state is cleared
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.closeProfileDropdown(); // Close profile dropdown when opening mobile menu
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleProfileDropdown(event: Event): void {
    event.stopPropagation(); // Prevent document click listener from closing it immediately
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    if (this.isProfileDropdownOpen) {
      this.closeMenu(); // Close mobile menu when opening profile dropdown
    }
  }

  closeProfileDropdown(): void {
    this.isProfileDropdownOpen = false;
  }

  // Helper for navigating and closing menus
  navigateAndCloseMenus(path: string): void {
    this.router.navigate([path]);
    this.closeMenu();
    this.closeProfileDropdown();
  }
}