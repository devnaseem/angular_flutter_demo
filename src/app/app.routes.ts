// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { WellnessComponent } from './wellness/wellness.component'; // Adjust the path as necessary

export const routes: Routes = [
  { path: 'wellness', component: WellnessComponent },
  // You can add more routes here if needed
];