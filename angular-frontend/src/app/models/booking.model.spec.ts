import { Booking } from './booking.model'; // Adjust the import based on your file structure

describe('Booking Models', () => {
  fit('Frontend_day28_should_create_Booking_instance', () => {
    const booking: Booking = {
        movieId : 2,
        totalCost : 10
    };

    expect(booking).toBeTruthy();
    expect(booking.movieId).toBe(2);
    expect(booking.totalCost).toBe(10);
  });
});
