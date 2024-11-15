import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet, Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'nas-angular-app';

  constructor(private router: Router) {
    // Subscribe to router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      console.log('Navigation End:', event.urlAfterRedirects);
    });
  }

  logClick(route: string) {
    console.log(`Link clicked: ${route}`);
  }
}