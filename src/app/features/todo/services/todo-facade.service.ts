import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoApiService } from '../../../core/services/api/todo.service';
import { 
  Todo, 
  TodoState, 
  CreateTodoDto, 
  UpdateTodoDto 
} from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoFacadeService {
  private state = new BehaviorSubject<TodoState>({
    todos: [],
    selectedTodo: null,
    loading: false,
    error: null
  });

  constructor(private todoApiService: TodoApiService) {
    this.loadTodos();
  }

  // Selectors
  getTodos(): Observable<Todo[]> {
    return this.state.asObservable().pipe(
      map(state => state.todos)
    );
  }

  getLoading(): Observable<boolean> {
    return this.state.asObservable().pipe(
      map(state => state.loading)
    );
  }

  getError(): Observable<string | null> {
    return this.state.asObservable().pipe(
      map(state => state.error)
    );
  }

  // Actions
  loadTodos(): void {
    this.setLoading(true);
    this.todoApiService.getAllTodos().subscribe({
      next: (todos) => {
        this.updateState({ todos, error: null });
      },
      error: (error) => {
        this.updateState({ error: error.message });
      },
      complete: () => {
        this.setLoading(false);
      }
    });
  }

  createTodo(todo: CreateTodoDto): void {
    this.setLoading(true);
    this.todoApiService.createTodo(todo).subscribe({
      next: (newTodo) => {
        const currentTodos = this.state.value.todos;
        this.updateState({ 
          todos: [...currentTodos, newTodo],
          error: null 
        });
      },
      error: (error) => {
        this.updateState({ error: error.message });
      },
      complete: () => {
        this.setLoading(false);
      }
    });
  }

  updateTodo(todo: UpdateTodoDto): void {
    this.setLoading(true);
    this.todoApiService.updateTodo(todo).subscribe({
      next: (updatedTodo) => {
        const currentTodos = this.state.value.todos;
        this.updateState({
          todos: currentTodos.map(t => t.id === updatedTodo.id ? updatedTodo : t),
          error: null
        });
      },
      error: (error) => {
        this.updateState({ error: error.message });
      },
      complete: () => {
        this.setLoading(false);
      }
    });
  }

  deleteTodo(id: string): void {
    this.setLoading(true);
    this.todoApiService.deleteTodo(id).subscribe({
      next: () => {
        const currentTodos = this.state.value.todos;
        this.updateState({
          todos: currentTodos.filter(t => t.id !== id),
          error: null
        });
      },
      error: (error) => {
        this.updateState({ error: error.message });
      },
      complete: () => {
        this.setLoading(false);
      }
    });
  }

  // Helper methods
  private setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  private updateState(partialState: Partial<TodoState>): void {
    this.state.next({
      ...this.state.value,
      ...partialState
    });
  }
}
