import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model'; // Corrected import path
import { UserStoreService } from '../helpers/user-store.service'; // Corrected import path

// Define a more specific type for the payload of add/update event
interface EventPayload {
  title: string;
  duration: number;
  venue: string;
  category: string; // EventCategory enum value as string
  ticketPrice: number;
  rows: number;
  seatsPerRow: number;
  imageUrl?: string; // Optional
  description?: string; // Optional
  eventDateTime: string; // ISO string format
}


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private adminApiUrl = "http://localhost:8080/api/admin/listing";
  private publicUserApiBaseUrl = "http://localhost:8080/api/user"; // Base for user-facing event endpoints

  constructor(private http: HttpClient, private userStore: UserStoreService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.userStore.authUser?.jwtToken;
    if (!token) {
        console.warn('Auth token is not available for request requiring authentication.');
        // Optionally throw an error or handle as per application's auth flow
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Admin: Add Event
  addEvent(eventData: EventPayload): Observable<Event> { // Use EventPayload
    return this.http.post<Event>(`${this.adminApiUrl}/create`, eventData, { headers: this.getAuthHeaders() });
  }

  // Public/User: Get all events
  // Backend returns UserController.UnauthorizedFetchEventResponse
  // This response DTO now includes ticketPrice and totalSeats
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.publicUserApiBaseUrl}/events`);
  }

  // Public/User: Get a single event by ID
  // Backend returns full Event entity
  getEventById(eventId: number): Observable<Event> {
    return this.http.get<Event>(`${this.publicUserApiBaseUrl}/event/${eventId}`);
  }

  // Admin: Update Event
  updateEvent(eventId: number, eventData: EventPayload): Observable<Event> { // Use EventPayload
    return this.http.put<Event>(`${this.adminApiUrl}/edit/${eventId}`, eventData, { headers: this.getAuthHeaders() });
  }

  // Admin: Delete Event
  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/edit/${eventId}`, { headers: this.getAuthHeaders() });
  }
}