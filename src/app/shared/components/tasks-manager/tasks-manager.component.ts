import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { TodoListComponent } from '@features/todo/components/todo-list/todo-list.component';
import { TodoFacadeService } from '@features/todo/services/todo-facade.service';
import { Todo } from '@features/todo/models/todo.model';

export type FilterType = 'all' | 'pending' | 'completed' | 'urgent';

@Component({
  selector: 'app-tasks-manager',
  templateUrl: './tasks-manager.component.html',
  styleUrls: ['./tasks-manager.component.scss'],
  standalone: true,
  imports: [CommonModule, TodoListComponent]
})
export class TasksManagerComponent implements OnInit {
  @Output() editTodo = new EventEmitter<Todo>();
  
  activeFilter: FilterType = 'all';
  totalTasks$: Observable<number>;

  constructor(private todoFacade: TodoFacadeService) {
    this.totalTasks$ = this.todoFacade.getTodos().pipe(
      map(todos => todos.length)
    );
  }

  ngOnInit(): void {
    // Component initialization
  }

  setFilter(filter: FilterType): void {
    this.activeFilter = filter;
    this.todoFacade.loadTodosByFilter(filter);
  }

  isFilterActive(filter: FilterType): boolean {
    return this.activeFilter === filter;
  }

  getTotalTasks(): Observable<number> {
    return this.totalTasks$;
  }

  onEditTodo(todo: Todo): void {
    this.editTodo.emit(todo);
  }
}
