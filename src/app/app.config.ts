// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { PreloadingStrategy, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { PreloadFlutterService } from './preload-flutter.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: PreloadingStrategy, useClass: PreloadFlutterService },
    // ... other providers if any
  ],
};
