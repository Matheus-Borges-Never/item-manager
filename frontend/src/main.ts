import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environments';
import { importProvidersFrom } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

initializeApp(environment.firebaseConfig);

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), importProvidersFrom(FontAwesomeModule)],
}).catch((err) => console.error(err));
