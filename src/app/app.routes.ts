// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WellnessComponent } from './wellness/wellness.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'wellness', component: WellnessComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
