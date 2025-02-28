import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environments';
import { importProvidersFrom } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';

initializeApp(environment.firebaseConfig);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FontAwesomeModule),
    provideHttpClient(),
    provideAnimations(),
    ...appConfig.providers,
  ],
}).catch((err) => console.error(err));
