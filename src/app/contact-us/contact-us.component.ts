// src/app/contact-us/contact-us.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Contact Us</h2>
    <p>Feel free to reach out!</p>
    <!-- Add your contact form or information here -->
  `,
  styles: [`
    h2 {
      color: #0C4762;
    }
  `],
})
export class ContactUsComponent {}
