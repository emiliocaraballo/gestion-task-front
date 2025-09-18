import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Todo } from '@features/todo/models/todo.model';
import { TodoFacadeService } from '@features/todo/services/todo-facade.service';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  standalone: true,
  imports: [CommonModule, TodoFormComponent, TodoItemComponent]
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private todoFacade: TodoFacadeService) {
    this.todos$ = this.todoFacade.getTodos();
    this.loading$ = this.todoFacade.getLoading();
    this.error$ = this.todoFacade.getError();
  }

  ngOnInit(): void {
    this.todoFacade.loadTodos();
  }

  onTodoCreated(todo: Todo): void {
    this.todoFacade.createTodo({
      title: todo.title,
      description: todo.description || '',
      completed: todo.completed
    });
  }

  onTodoUpdated(todo: Todo): void {
    if (todo.id) {
      this.todoFacade.updateTodo({
        id: todo.id,
        title: todo.title,
        description: todo.description || '',
        completed: todo.completed
      });
    }
  }

  onTodoDeleted(id: string): void {
    this.todoFacade.deleteTodo(id);
  }

  retryLoad(): void {
    this.todoFacade.loadTodos();
  }

  getCompletedCount(todos: Todo[]): number {
    return todos.filter(todo => todo.completed).length;
  }

  getPendingCount(todos: Todo[]): number {
    return todos.filter(todo => !todo.completed).length;
  }

  trackByFn(index: number, todo: Todo): string {
    return todo.id || String(index);
  }
}