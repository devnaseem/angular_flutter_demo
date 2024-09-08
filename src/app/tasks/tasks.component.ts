import { Component, Input } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { type NewTask } from './new-task/newTask.model';
import { TaskService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskComponent, NewTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {

  onAddTask() {
    this.isAddingTask = true;
  }
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) userName!: string;
  isAddingTask = false;

  constructor(private taskService: TaskService) {
    this.taskService = taskService;
  }

  get selectedUserTasks() {
    return this.taskService.getUserTasks(this.userId);
  }

  onCloseAddtask() {
    this.isAddingTask = false;
  }

}
