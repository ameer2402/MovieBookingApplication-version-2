import { SeatStatus } from './seat-status.enum';

export interface Seat {
    seatName: string;
    status: SeatStatus; // This is crucial
}