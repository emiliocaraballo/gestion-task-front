import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { TodoListComponent } from '@features/todo/components/todo-list/todo-list.component';
import { KanbanBoardComponent } from '@features/todo/components/kanban-board/kanban-board.component';
import { TodoFacadeService } from '@features/todo/services/todo-facade.service';
import { Todo } from '@features/todo/models/todo.model';

export type FilterType = 'all' | 'pending' | 'completed' | 'urgent';

@Component({
  selector: 'app-tasks-manager',
  templateUrl: './tasks-manager.component.html',
  styleUrls: ['./tasks-manager.component.scss'],
  standalone: true,
  imports: [CommonModule, TodoListComponent, KanbanBoardComponent]
})
export class TasksManagerComponent implements OnInit {
  @Output() editTodo = new EventEmitter<Todo>();
  
  activeFilter: FilterType = 'all';
  totalTasks$: Observable<number>;
  todos$: Observable<Todo[]>;
  
  // Vista actual: 'grid' para tarjetas, 'kanban' para board
  currentView: 'grid' | 'kanban' = 'grid';

  constructor(private todoFacade: TodoFacadeService) {
    this.totalTasks$ = this.todoFacade.getTodos().pipe(
      map(todos => todos.length)
    );
    
    this.todos$ = this.todoFacade.getTodos();
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

  setView(view: 'grid' | 'kanban'): void {
    this.currentView = view;
  }

  isViewActive(view: 'grid' | 'kanban'): boolean {
    return this.currentView === view;
  }

  onTodoUpdated(todo: Todo): void {
    if (todo.id) {
      this.todoFacade.updateTodo({
        id: todo.id,
        title: todo.title,
        description: todo.description || '',
        status: todo.status,
        completed: todo.completed,
        category: todo.category,
        priority: todo.priority,
        dueDate: todo.dueDate
      });
    }
  }
}
