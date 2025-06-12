import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Booking } from '../models/booking.model';
import { UserBookingDisplay } from '../models/user-booking-display.model'; // Import new model
import { Observable } from 'rxjs';
import { UserStoreService } from '../helpers/user-store.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private userBookingApiUrl = "http://localhost:8080/api/booking";
  private adminBookingApiUrl = "http://localhost:8080/api/admin/bookings"; // For admin operations

  constructor(private http: HttpClient, private userStore: UserStoreService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.userStore.authUser?.jwtToken;
     if (!token) {
        console.warn('Auth token is not available for request requiring authentication.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // User: Add Booking
  addBooking(eventId: number, selectedSeatNames: string[]): Observable<Booking> { // Returns Booking DTO from backend
    const payload = {
      listingId: eventId,
      selectedSeats: selectedSeatNames
    };
    return this.http.post<Booking>(`${this.userBookingApiUrl}/create`, payload, { headers: this.getAuthHeaders() });
  }

  // User: Get their own bookings
  // Backend returns Collection<fetchBookingsResponse>
  getUserBookings(): Observable<UserBookingDisplay[]> { // Use UserBookingDisplay
    return this.http.get<UserBookingDisplay[]>(this.userBookingApiUrl, { headers: this.getAuthHeaders() });
  }

  // Admin: Get all bookings in the system
  // Backend returns List<Booking>
  getAllSystemBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.adminBookingApiUrl}/all`, { headers: this.getAuthHeaders() });
  }
}