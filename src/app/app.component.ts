import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { TasksManagerComponent } from './shared/components/tasks-manager/tasks-manager.component';
import { TodoModalComponent } from './features/todo/components/todo-modal/todo-modal.component';
import { TodoFacadeService } from './features/todo/services/todo-facade.service';
import { Todo } from './features/todo/models/todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    DashboardComponent, 
    TasksManagerComponent, 
    TodoModalComponent
  ]
})
export class AppComponent {
  // Modal state
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedTodo: Todo | null = null;

  constructor(private todoFacade: TodoFacadeService) {}

  openCreateTaskModal(): void {
    this.modalMode = 'create';
    this.selectedTodo = null;
    this.isModalOpen = true;
  }

  openEditTaskModal(todo: Todo): void {
    this.modalMode = 'edit';
    this.selectedTodo = todo;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedTodo = null;
  }

  onSaveTodo(todo: Todo): void {
    if (this.modalMode === 'create') {
      this.todoFacade.createTodo({
        title: todo.title,
        description: todo.description || '',
        completed: todo.completed,
        category: todo.category,
        priority: todo.priority,
        dueDate: todo.dueDate
      });
    } else if (this.modalMode === 'edit' && todo.id) {
      this.todoFacade.updateTodo({
        id: todo.id,
        title: todo.title,
        description: todo.description || '',
        completed: todo.completed,
        category: todo.category,
        priority: todo.priority,
        dueDate: todo.dueDate
      });
    }
    this.closeModal();
  }
}