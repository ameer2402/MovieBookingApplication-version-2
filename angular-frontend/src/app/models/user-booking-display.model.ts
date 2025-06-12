// This model matches the structure of fetchBookingsResponse from BookingController
export interface UserBookingDisplay {
    bookingId: number;
    selectedSeats: string[];
    totalCost: number;
    title: string; // Event title
    venue: string; // Event venue
    eventDateTime: string; // Event date and time as string (LocalDateTime serialized)
}