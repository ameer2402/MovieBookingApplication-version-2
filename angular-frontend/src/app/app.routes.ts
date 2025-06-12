import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ErrorComponent } from './components/error/error';
// Updated component imports
import { AdminAddEventComponent } from './components/admin-add-event/admin-add-event';
import { AdminviewbookingComponent } from './components/adminviewbooking/adminviewbooking'; // Assuming name stays if structure is same
import { AdminViewEventComponent } from './components/admin-view-event/admin-view-event';
import { UserViewEventComponent } from './components/user-view-event/user-view-event';
import { UserviewbookingComponent } from './components/userviewbooking/userviewbooking'; // Assuming name stays
import { UserBookingEventComponent } from './components/user-booking-event/user-booking-event';

import { LoginComponent } from './components/login/login';
import { RegistrationComponent } from './components/registration/registration';
import { authGuard } from './guards/auth.guard';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {
    path: 'admin/add/newEvent', // Updated path
    component: AdminAddEventComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'admin/view/events', // Updated path
    component: AdminViewEventComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'admin/view/all-bookings', // Path can be more descriptive
    component: AdminviewbookingComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'user/view/events', // Updated path
    component: UserViewEventComponent,
    canActivate: [authGuard],
    data: { role: 'USER' }
  },
  {
    path: 'user/my-bookings', // Path can be more descriptive
    component: UserviewbookingComponent,
    canActivate: [authGuard],
    data: { role: 'USER' }
  },
  {
    path: 'user/book-event/:eventId', // Updated path
    component: UserBookingEventComponent,
    canActivate: [authGuard],
    data: { role: 'USER' }
  },
  { path: '**', redirectTo: '/error' }
];