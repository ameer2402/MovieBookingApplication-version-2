import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // DecimalPipe is part of CommonModule
import { UserStoreService } from '../../helpers/user-store.service';
// import { Booking } from '../../models/booking.model'; // Not used directly if UserBookingDisplay is used
import { UserBookingDisplay } from '../../models/user-booking-display.model'; // Use this model
import { BookingService } from '../../services/booking.service';
import { RouterModule } from '@angular/router'; // For routerLink if needed

@Component({
  selector: 'app-userviewbooking',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add RouterModule
  templateUrl: './userviewbooking.html',
  styleUrls: ['./userviewbooking.css']
})
export class UserviewbookingComponent implements OnInit {
  userBookings: UserBookingDisplay[] = []; // Use UserBookingDisplay
  userId?: number;
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private bookingService: BookingService,
    private userStoreService: UserStoreService
  ) { }

  ngOnInit(): void {
    this.userId = this.userStoreService.getCurrentUserId(); // Use dedicated method
    if (this.userId !== undefined) {
      this.loadUserBookings();
    } else {
      this.errorMessage = "User ID not found. Cannot load bookings. Please login.";
      this.isLoading = false;
      console.error(this.errorMessage);
    }
  }

  loadUserBookings(): void {
    if (this.userId === undefined) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.bookingService.getUserBookings().subscribe({
      next: (data: UserBookingDisplay[]) => { // Expect UserBookingDisplay[]
        this.userBookings = data;
        if (this.userBookings.length === 0) {
            this.errorMessage = "You have no bookings yet.";
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error fetching user bookings", error);
        this.errorMessage = "Failed to load your booking history. Please try again later.";
        this.isLoading = false;
      }
    });
  }

  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return 'N/A';
    try {
      const date = new Date(dateTimeString);
      //toLocaleString gives a user-friendly format
      return date.toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateTimeString; // fallback to original string if parsing fails
    }
  }
}