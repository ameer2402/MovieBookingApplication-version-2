import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngIf, *ngFor, DecimalPipe
import { FormsModule } from '@angular/forms';   // For ngModel
import { Booking } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';


interface SortOption {
  value: keyof Booking | 'id'; // Ensure value is a valid key of Booking
  label: string;
}

@Component({
  selector: 'app-adminviewbooking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adminviewbooking.html',
  styleUrls: ['./adminviewbooking.css']
})
export class AdminviewbookingComponent implements OnInit {
  bookings: Booking[] = [];
  errorMessage: string = '';
  
  sortOptions: SortOption[] = [
    { value: 'id', label: 'Booking ID' },
    { value: 'seatCount', label: 'Number of Seats' },
    { value: 'totalCost', label: 'Total Cost' }
  ];
  selectedSortField: keyof Booking | 'id' = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getAllSystemBookings().subscribe({
      next: (data: Booking[]) => { // Type 'data'
        this.bookings = data;
        this.sortBookings(); 
      },
      error: (error: any) => { // Type 'error'
        console.error('Error loading bookings', error);
        this.errorMessage = "Error Loading Bookings";
      }
    });
  }

  sortBookings() {
    if (!this.selectedSortField) return;

    this.bookings.sort((a, b) => {
      let valueA: any = a[this.selectedSortField as keyof Booking];
      let valueB: any = b[this.selectedSortField as keyof Booking];

      // Handle cases where properties might be undefined or nested (though not in current model for these fields)
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
      
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortBookings();
  }

  calculateTotalRevenue(): number {
    return this.bookings.reduce((total, booking) => total + (booking.totalCost || 0), 0);
  }

  onSortFieldChange() {
    this.sortBookings();
  }
}