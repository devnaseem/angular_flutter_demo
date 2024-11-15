// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { TasksComponent } from '../tasks/tasks.component';
import { DUMMY_USERS } from '../dummy-users';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UserComponent, TasksComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  selectedUserId?: string;
  users = DUMMY_USERS;

  constructor() {}

  ngOnInit(): void {}

  get selectedUser() {
    return this.users.find((user) => user.id === this.selectedUserId);
  }

  onSelectUser(id: string) {
    this.selectedUserId = id;
  }

  trackByUserId(index: number, user: any): string {
    return user.id;
  }
}
