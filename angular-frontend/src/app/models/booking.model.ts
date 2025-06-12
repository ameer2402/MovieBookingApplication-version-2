import { Event } from './event.model'; // Use the new Event model

export interface BookingUserStub { // Simplified user for booking display
  userId?: number;
  username?: string;
}

export interface Booking {
    id?: number; // Booking ID
    user?: BookingUserStub; // Simplified user info
    event?: Event;        // Full event info (or a stub if preferred for lists)
    userId?: number;      // For creating booking if not sending full user object
    eventId?: number;     // For creating booking, linking to the Event
    seatCount?: number;
    totalCost?: number;
    bookedSeatNumbers?: string[]; // e.g., ["A1", "B5"]
}