import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { HeaderComponent } from './app/header/header.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
