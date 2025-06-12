import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Event as AppEvent } from '../../models/event.model'; // Renamed import
import { EventService } from '../../services/event.service'; // Renamed service

@Component({
  selector: 'app-admin-view-event',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add RouterModule
  templateUrl: './admin-view-event.html',
  styleUrls: ['./admin-view-event.css']
})
export class AdminViewEventComponent implements OnInit {
  events: AppEvent[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;
  
  constructor(
    private eventService: EventService,
    private router: Router
  ) { }

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
          // Use a safer default image or placeholder logic
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

  deleteEvent(eventId?: number): void {
    if (eventId === undefined) {
        this.errorMessage = 'Cannot delete event: Invalid Event ID.';
        return;
    }
    if(confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.events = this.events.filter(event => event.id !== eventId);
          alert('Event deleted successfully');
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = `Error deleting event: ${error.error?.message || error.message}`;
          console.error('Delete event error', error);
        }
      });
    }
  }

  updateEvent(event: AppEvent): void {
    if(event.id !== undefined && !isNaN(event.id)){
      // Pass eventId as query parameter to the add/edit component
      this.router.navigate(['/admin/add/newEvent'], { queryParams: { id: event.id }});
    } else {
      this.errorMessage="Invalid Event Id for update.";
      console.error('Invalid event Id for update', event);
    }
  }

  addNewEvent(): void {
    this.router.navigate(['/admin/add/newEvent']); // Updated route
  }
}