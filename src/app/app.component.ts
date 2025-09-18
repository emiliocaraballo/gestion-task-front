import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './features/todo/components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, TodoListComponent]
})
export class AppComponent {
  title = 'Todo App';
}