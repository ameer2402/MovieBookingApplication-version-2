import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // RouterModule for routerLink
import { EventService } from '../../services/event.service';
import { Event as AppEvent } from '../../models/event.model'; // Renamed import
import { EventCategory } from '../../models/event-category.enum';
import { AuthService } from '../../services/auth.service'; // To check login status
// For a real carousel, you'd import its module:
// import { CarouselModule } from 'ngx-owl-carousel-o'; // If using ngx-owl-carousel-o

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Needed for routerLink
    // CarouselModule // If using ngx-owl-carousel-o
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  featuredEvents: AppEvent[] = [];
  eventsByCategory: { category: EventCategory, events: AppEvent[] }[] = [];
  allEvents: AppEvent[] = []; // Store all fetched events

  isLoading: boolean = true;
  errorMessage: string = '';

  // For basic pseudo-carousel
  currentFeaturedIndex = 0;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    // Placeholder for location prompt
    this.promptLocation();
  }

  promptLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // You would then use a reverse geocoding service or store lat/lon
        // For now, just log it.
        console.log(`Latitude: ${lat}, Longitude: ${lon}`);
        alert(`Location captured (mock): Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}`);
        // Potentially store this location in a service for search filtering
      }, (error) => {
        console.warn(`Geolocation error: ${error.message}`);
        // Handle error (e.g., user denied, or default to a general location)
        alert("Could not get your location. Displaying general events.");
      });
    } else {
      console.warn("Geolocation is not supported by this browser.");
      alert("Geolocation not supported. Displaying general events.");
    }
  }


  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.allEvents = data.map(event => ({
          ...event,
          // Use a safer default image or placeholder logic
          imageUrl: event.imageUrl || `https://picsum.photos/seed/${event.id || 'event'}/600/400`
        }));

        // Create featured events (e.g., first 5 or random)
        this.featuredEvents = this.allEvents.slice(0, Math.min(5, this.allEvents.length));

        // Group events by category
        this.groupEventsByCategory();

        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Could not load events. Please try again later.';
        console.error('Error loading events for home page:', error);
        this.isLoading = false;
      }
    });
  }

  groupEventsByCategory(): void {
    const categories = Object.values(EventCategory);
    this.eventsByCategory = categories.map(category => {
      const filteredEvents = this.allEvents.filter(event => event.category === category);
      return { category: category, events: filteredEvents.slice(0, Math.min(10, filteredEvents.length)) }; // Show up to 10 per category
    }).filter(group => group.events.length > 0); // Only include categories that have events
  }

  handleEventClick(eventId?: number): void {
    if (eventId === undefined) return;

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/user/book-event', eventId]);
    } else {
      // Placeholder for toast notification
      alert('Please login to book tickets.'); // Replace with toast
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/user/book-event/${eventId}` } });
    }
  }

  // Basic pseudo-carousel logic
  nextFeatured(): void {
    this.currentFeaturedIndex = (this.currentFeaturedIndex + 1) % this.featuredEvents.length;
  }

  prevFeatured(): void {
    this.currentFeaturedIndex = (this.currentFeaturedIndex - 1 + this.featuredEvents.length) % this.featuredEvents.length;
  }
}