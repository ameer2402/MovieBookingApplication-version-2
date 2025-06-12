import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStoreService } from '../../helpers/user-store.service';
import { Booking } from '../../models/booking.model';
import { Event as AppEvent } from '../../models/event.model';
import { Seat } from '../../models/seat.model';
import { SeatStatus } from '../../models/seat-status.enum';
import { EventCategory } from '../../models/event-category.enum';
// import { Seat, SeatStatus, EventCategory } from '../../models'; 
// import { SeatStatus } from '../../models';
// import { Booking, Event as AppEvent, Seat, SeatStatus, EventCategory } from '../../models'; // KEEP THIS

import { BookingService } from '../../services/booking.service';
import { EventService } from '../../services/event.service';

interface DisplaySeat extends Seat {
  id: string; // "A1", "B2"
  row: number;
  col: number;
  visualStatus: 'available' | 'booked' | 'reserved' | 'blocked' | 'selected-by-user';
}

@Component({
  selector: 'app-user-booking-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-booking-event.html',
  styleUrls: ['./user-booking-event.css']
})
export class UserBookingEventComponent implements OnInit {
  eventId!: number;
  event: AppEvent | null = null;
  public readonly String = String;
  
  quantityToSelect: number = 1;
  maxQuantity: number = 10; // Max per booking, can be dynamic
  
  displaySeats: DisplaySeat[][] = [];
  selectedSeatNames: string[] = [];

  totalCost: number = 0;
  errorMessage: string = '';
  isLoading: boolean = true;
  currentStep: 'selection' | 'payment' | 'confirmation' = 'selection';
  paymentSuccessful: boolean = false;
  bookingError: string = '';
  bookingResponse: Booking | null = null;


  // For dummy payment form
  paymentDetails = {
     cardNumber: '',
     expiryDate: '',
     cvv: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private bookingService: BookingService,
    private userStoreService: UserStoreService
  ) { }

  ngOnInit(): void {
    const eventIdParam = this.route.snapshot.paramMap.get('eventId');
    if (eventIdParam) {
      this.eventId = +eventIdParam;
      this.loadEventDetails();
    } else {
      this.handleErrorAndStop('Event ID not found in route.');
      this.router.navigate(['/error']);
      return;
    }
  }

  loadEventDetails(): void {
    this.isLoading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        this.event = data;
        if (this.event) {
          this.prepareDisplaySeats(this.event.seatingChart);
          // Cap max quantity to available seats or a general max
          this.maxQuantity = Math.min(this.event.totalSeats, 10);
          this.updateTotalCost();
        } else {
          this.handleErrorAndStop('Event details could not be loaded.');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.handleErrorAndStop('Error loading event details');
        console.error('Load event error', error);
        this.isLoading = false;
      }
    });
  }
  
  prepareDisplaySeats(seatingChart: Seat[][]): void {
    this.displaySeats = seatingChart.map((row, rowIndex) =>
        row.map((seat, colIndex) => {
            let visualStatus: DisplaySeat['visualStatus'] = 'available';
            // The original seat.status comes from the backend via seatingChart
            const originalBackendStatus = seat.status; // This is the status from Seat interface
            switch(originalBackendStatus) { // Use the original status for logic
                case SeatStatus.AVAILABLE: visualStatus = 'available'; break;
                case SeatStatus.BOOKED: visualStatus = 'booked'; break;
                case SeatStatus.RESERVED: visualStatus = 'reserved'; break;
                case SeatStatus.BLOCKED: visualStatus = 'blocked'; break;
            }
            return {
                ...seat, // This will include seatName and the original 'status'
                id: seat.seatName,
                row: rowIndex,
                col: colIndex,
                visualStatus: visualStatus
                // So, 'seat.status' in the template should refer to the original backend status
            };
        })
    );
  }

 handleSeatClick(seat: DisplaySeat): void {
     if (seat.visualStatus === 'booked' || seat.visualStatus === 'reserved' || seat.visualStatus === 'blocked') {
         return; // Cannot select these seats
     }

     const seatIndexInSelection = this.selectedSeatNames.indexOf(seat.id);

     if (seat.visualStatus === 'selected-by-user') { // Deselecting
         seat.visualStatus = 'available';
         this.selectedSeatNames.splice(seatIndexInSelection, 1);
     } else if (seat.visualStatus === 'available') { // Selecting
         if (this.selectedSeatNames.length < this.quantityToSelect) {
             seat.visualStatus = 'selected-by-user';
             this.selectedSeatNames.push(seat.id);
         } else {
             alert(`You can only select ${this.quantityToSelect} seat(s). Please adjust quantity or deselect another seat.`);
         }
     }
     this.updateTotalCost();
 }
 
 updateTotalCost(): void {
     if (this.event) {
         this.totalCost = this.selectedSeatNames.length * this.event.ticketPrice;
     }
 }

 incrementQuantity(): void {
     if (this.event && this.quantityToSelect < this.maxQuantity) {
         this.quantityToSelect++;
         // If auto-selecting seats is desired, add logic here, or just update cost
     }
 }

 decrementQuantity(): void {
     if (this.quantityToSelect > 1) {
         this.quantityToSelect--;
         // If current selected seats > new quantity, alert user or auto-deselect
         if (this.selectedSeatNames.length > this.quantityToSelect) {
             alert(`You have ${this.selectedSeatNames.length} seats selected. Reducing quantity to ${this.quantityToSelect}. Please deselect seats.`);
             // Optionally, clear selection:
             // this.clearAllSelections();
         }
     }
 }

 clearAllSelections(): void {
     this.displaySeats.forEach(row => row.forEach(s => {
         if (s.visualStatus === 'selected-by-user') s.visualStatus = 'available';
     }));
     this.selectedSeatNames = [];
     this.updateTotalCost();
 }
 
 proceedToPayment(): void {
     if (!this.event) {
         this.errorMessage = "Event details not available.";
         return;
     }
     if (this.selectedSeatNames.length !== this.quantityToSelect) {
         alert(`Please select exactly ${this.quantityToSelect} seat(s). You have selected ${this.selectedSeatNames.length}.`);
         return;
     }
     if (this.selectedSeatNames.length === 0) {
         alert('Please select at least one seat.');
         return;
     }
     this.currentStep = 'payment';
 }

 // Dummy Payment Logic
 submitPayment(form: any): void { // Replace 'any' with NgForm if using template-driven form for payment
     if (!form.valid) { // Basic validation check
         this.bookingError = "Please fill in all payment details correctly.";
         return;
     }
     this.bookingError = '';
     this.isLoading = true; // Show loading for payment processing
     console.log("Simulating payment for:", this.paymentDetails);
     
     // Simulate API call for payment
     setTimeout(() => {
         const isSuccess = Math.random() > 0.2; // 80% success rate
         if (isSuccess) {
             this.paymentSuccessful = true;
             this.createActualBooking();
         } else {
             this.paymentSuccessful = false;
             this.bookingError = "Payment Failed. Please try again or use a different card.";
             this.isLoading = false;
             this.currentStep = 'payment'; // Stay on payment step
         }
     }, 2000); // Simulate 2-second delay
 }

 createActualBooking(): void {
     const currentUserId = this.userStoreService.getCurrentUserId();
     if (!this.event || !currentUserId) {
         this.bookingError = "Cannot create booking. User or Event data missing.";
         this.isLoading = false;
         this.currentStep = 'confirmation'; // Show error in confirmation
         return;
     }

     this.bookingService.addBooking(this.event.id!, this.selectedSeatNames).subscribe({
         next: (bookingConfirmation) => {
             this.bookingResponse = bookingConfirmation;
             this.currentStep = 'confirmation';
             this.isLoading = false;
         },
         error: (err) => {
             this.bookingError = `Booking failed: ${err.error?.message || err.message || 'Server error'}`;
             console.error('Booking creation error', err);
             this.currentStep = 'confirmation'; // Show error in confirmation
             this.isLoading = false;
         }
     });
 }
  
 private handleErrorAndStop(message: string): void {
     this.errorMessage = message;
     this.isLoading = false;
     // Consider navigating away or disabling functionality
 }

 navigateToMyBookings(): void {
     this.router.navigate(['/user/my-bookings']);
 }

 goBackToSelection(): void {
     this.currentStep = 'selection';
     this.bookingError = '';
 }

}