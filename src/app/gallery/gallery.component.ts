// src/app/gallery/gallery.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Gallery</h2>
    <p>Welcome to the Gallery page!</p>
    <!-- Add your gallery content here -->
  `,
  styles: [`
    h2 {
      color: #0C4762;
    }
  `],
})
export class GalleryComponent {}
