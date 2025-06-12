import { EventCategory } from './event-category.enum';
import { Seat } from './seat.model';

export interface Event {
    id?: number;
    title: string;
    duration: number; // in minutes
    venue: string;
    category: EventCategory;
    ticketPrice: number;
    totalSeats: number;
    seatingChart: Seat[][];
    imageUrl?: string; // << MAKE SURE THIS IS PRESENT
    description?: string;
    eventDateTime?: string;
    rows?: number;
    seatsPerRow?: number;
}