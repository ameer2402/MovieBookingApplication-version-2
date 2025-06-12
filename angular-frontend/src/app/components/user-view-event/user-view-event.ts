import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Event as AppEvent } from '../../models/event.model';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-user-view-event',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-view-event.html',
  styleUrls: ['./user-view-event.css'] // You can reuse admin's or create specific
})
export class UserViewEventComponent implements OnInit {
  events: AppEvent[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data.map(event => ({
          ...event,
          imageUrl: event.imageUrl || `https://picsum.photos/seed/${event.title}/400/600`
        }));
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading events. Please try again later.';
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  navigateToBooking(eventId?: number): void {
    if (eventId !== undefined) {
      this.router.navigate(['/user/book-event', eventId]); // Updated route
    } else {
      this.errorMessage = "Cannot book event: Invalid Event ID.";
      console.error(this.errorMessage);
    }
  }
}