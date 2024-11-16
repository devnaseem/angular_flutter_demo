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
   p {
        margin: 0.5rem;
        padding: 0.2rem;
      }
      h2 {
        color: #0c4762;
        margin: 0.5rem;
        padding: 0.2rem;
      }
  `],
})
export class ContactUsComponent {}
