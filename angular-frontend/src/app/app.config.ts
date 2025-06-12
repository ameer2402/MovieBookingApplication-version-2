import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule } from '@angular/forms'; // Optionally provide globally if used extensively

import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptorsFromDi()), // Modern way to provide HttpClient and support interceptors
    importProvidersFrom(
      BrowserModule // Necessary for bootstrapApplication
      // FormsModule // Or import it directly in components that need it
    ),
    // Add other global providers here if any (e.g., for state management, interceptors)
  ]
};