import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd, RouterModule } from '@angular/router'; // Import RouterModule and NavigationEnd
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { DUMMY_USERS } from './dummy-users';
import { TasksComponent } from './tasks/tasks.component';
import { Subscription } from 'rxjs';

import { WellnessComponent } from './wellness/wellness.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, UserComponent, TasksComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  onAddFeature() {
    //throw new Error('Method not implemented.');
  }

  showLayout: boolean = true; // Flag to determine whether to show header and main

  private routerSubscription!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current URL starts with '/wellness'
        this.showLayout = !event.urlAfterRedirects.startsWith('/wellness');
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  onAddTask() {
    this.router.navigate(['/wellness']);
  }

  selectedUserId?: String;

  get selectedUser() {
    return this.users.find((user) => user.id === this.selectedUserId);
  }

  onSelectUser(id: string) {
    this.selectedUserId = id;
  }
  title = 'nas-angular-app';
  users = DUMMY_USERS;
}
