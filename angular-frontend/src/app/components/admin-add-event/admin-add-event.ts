import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Event model from models folder is not directly used for form data, but EventCategory is
import { EventCategory } from '../../models/event-category.enum';
import { EventService } from '../../services/event.service';
import { Event as AppEvent } from '../../models/event.model'; // For loading event data

interface EventFormData {
  title: string;
  duration: number | null;
  venue: string;
  category: EventCategory | null;
  ticketPrice: number | null;
  rows: number | null;
  seatsPerRow: number | null;
  imageUrl: string | null;
  description: string | null;
  eventDateTime: string | null; // Store as ISO string (YYYY-MM-DDTHH:mm) from datetime-local
}

@Component({
  selector: 'app-admin-add-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-add-event.html',
  styleUrls: ['./admin-add-event.css']
})
export class AdminAddEventComponent implements OnInit {
  eventFormData: EventFormData = {
    title: '',
    duration: null,
    venue: '',
    category: null,
    ticketPrice: null,
    rows: null,
    seatsPerRow: null,
    imageUrl: '',
    description: '',
    eventDateTime: null
  };
  isEditing: boolean = false;
  errorMessage: string = '';
  eventId?: number;
  eventCategories = Object.values(EventCategory);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => { // Changed to params from queryParams if using path variable for ID
      const idParam = params['id']; // Or queryParams if you pass it like /admin/add/newEvent?id=1
      // Check queryParams first, then params if you might use either
      let eventIdFromRoute = this.route.snapshot.queryParams['id'];
      if (!eventIdFromRoute && this.route.snapshot.paramMap.get('id')) {
           eventIdFromRoute = this.route.snapshot.paramMap.get('id');
      }


      if (eventIdFromRoute) {
        this.eventId = +eventIdFromRoute;
        this.isEditing = true;
        this.loadEventData(this.eventId);
      }
    });
  }

  loadEventData(id: number): void {
    this.eventService.getEventById(id).subscribe({
      next: (event: AppEvent) => { // Use AppEvent type
        this.eventFormData = {
          title: event.title,
          duration: event.duration,
          venue: event.venue,
          category: event.category,
          ticketPrice: event.ticketPrice,
          // For rows and seatsPerRow, if the backend Event object doesn't directly have them,
          // but they were used to generate seatingChart, you might need a way to get them.
          // Or, if editing an event means you can change seating, you might re-input them.
          // Assuming event.rows and event.seatsPerRow exist if they were part of initial creation DTO
          // If not, and seatingChart is the source of truth for layout:
          rows: event.seatingChart ? event.seatingChart.length : null,
          seatsPerRow: event.seatingChart && event.seatingChart[0] ? event.seatingChart[0].length : null,
          imageUrl: event.imageUrl || '',
          description: event.description || '',
          // eventDateTime from backend is likely an ISO string.
          // <input type="datetime-local"> expects "yyyy-MM-ddTHH:mm"
          eventDateTime: event.eventDateTime ? this.formatDateTimeForInput(event.eventDateTime) : null
        };
      },
      error: (error) => {
        this.errorMessage = 'Error loading event details for editing.';
        console.error('Error loading event:', error);
      }
    });
  }

  private formatDateTimeForInput(dateTimeString: string): string {
    // Input 'datetime-local' needs 'YYYY-MM-DDTHH:MM'
    // Backend might send 'YYYY-MM-DDTHH:MM:SS' or with Z for UTC.
    // This simple slice assumes the backend sends a compatible prefix.
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString); // Try to parse it
    if (isNaN(date.getTime())) { // Invalid date string
        return dateTimeString.substring(0, 16); // Fallback to simple substring if parsing fails but format is somewhat known
    }
    // Format to YYYY-MM-DDTHH:MM
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


  addOrUpdateEvent(): void {
    if (!this.eventFormData.title || !this.eventFormData.duration || !this.eventFormData.venue ||
        !this.eventFormData.category || !this.eventFormData.ticketPrice || !this.eventFormData.rows ||
        !this.eventFormData.seatsPerRow || !this.eventFormData.eventDateTime) {
         this.errorMessage = "All fields marked as required must be filled.";
         // Add visual indicators for required fields (e.g., *)
         return;
    }

    // Ensure all required fields for payload are not null
    if (this.eventFormData.duration === null || this.eventFormData.ticketPrice === null ||
        this.eventFormData.rows === null || this.eventFormData.seatsPerRow === null ||
        this.eventFormData.category === null || !this.eventFormData.eventDateTime) {
        this.errorMessage = "Core event details (duration, price, seating, category, date/time) cannot be empty.";
        return;
    }

     const payload = {
         title: this.eventFormData.title,
         duration: this.eventFormData.duration,
         venue: this.eventFormData.venue,
         category: this.eventFormData.category, // Already a string from EventCategory enum
         ticketPrice: this.eventFormData.ticketPrice,
         rows: this.eventFormData.rows,
         seatsPerRow: this.eventFormData.seatsPerRow,
         imageUrl: this.eventFormData.imageUrl || undefined, // Send undefined if empty, backend can handle default
         description: this.eventFormData.description || undefined,
         eventDateTime: this.eventFormData.eventDateTime // This should be in "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DDTHH:mm"
     };

    if (this.isEditing && this.eventId) {
      this.eventService.updateEvent(this.eventId, payload).subscribe({
        next: () => this.finishOperation('updated'),
        error: (error) => this.handleError('updating', error)
      });
    } else {
      this.eventService.addEvent(payload).subscribe({
        next: () => this.finishOperation('added'),
        error: (error) => this.handleError('adding', error)
      });
    }
  }

  private finishOperation(action: 'added' | 'updated'): void {
    alert(`Event ${action} successfully!`);
    this.router.navigate(['/admin/view/events']);
  }

  private handleError(action: string, error: any): void {
    this.errorMessage = `Error ${action} event: ${error.error?.message || error.error?.error || error.message || 'Unknown server error'}`;
    console.error(`Error ${action} event:`, error);
  }

  cancelOperation(): void {
    this.router.navigate(['/admin/view/events']);
  }
}