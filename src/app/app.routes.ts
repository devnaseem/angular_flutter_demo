// src/app/app.routes.ts
import { CustomRoute } from './custom-route.interface';
import { HomeComponent } from './home/home.component';
import { WellnessComponent } from './wellness/wellness.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

export const routes: CustomRoute[] = [
  { path: 'home', component: HomeComponent },
  { 
    path: 'wellness', 
    component: WellnessComponent, 
    data: { 
      preloadFlutter: true,
      hostElementId: 'flutter-app-wellness',
      assetBase: 'assets/flutter/wellness/',
      entrypointUrl: 'assets/flutter/wellness/main.dart.js'
    }
  },
  { 
    path: 'gallery', 
    component: GalleryComponent, 
    data: { 
      preloadFlutter: true,
      hostElementId: 'flutter-app-gallery',
      assetBase: 'assets/flutter/gallery/',
      entrypointUrl: 'assets/flutter/gallery/main.dart.js'
    }
  },
  { path: 'contact', component: ContactUsComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/home' }, // Wildcard route for 404
];
