import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoApiService } from '../../../core/services/api/todo.service';
import { 
  Todo, 
  TodoState, 
  CreateTodoDto, 
  UpdateTodoDto,
  TodoUtils 
} from '../models/todo.model';
import { TodoStats } from '../models/todo-stats.model';

@Injectable({
  providedIn: 'root'
})
export class TodoFacadeService {
  private state = new BehaviorSubject<TodoState>({
    todos: [],
    selectedTodo: null,
    loading: false,
    error: null,
    currentFilter: 'all'
  });

  // Subject para notificar cuando necesitamos refrescar las estadísticas
  private refreshStatsSubject = new Subject<void>();

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
  loadTodos(filters?: {filter?: string, category?: string, priority?: string}): void {
    this.setLoading(true);
    this.todoApiService.getAllTodos(filters).subscribe({
      next: (todos) => {
        this.updateState({ todos, error: null });
      },
      error: (error) => {
        this.updateState({ error: error.message });
        this.setLoading(false);
      },
      complete: () => {
        this.setLoading(false);
      }
    });
  }

  loadTodosByFilter(filter: 'all' | 'pending' | 'completed' | 'urgent'): void {
    // Guardar el filtro actual en el estado
    this.updateState({ currentFilter: filter });
    
    const filterParam = filter === 'all' ? undefined : filter;
    
    if (filter === 'urgent') {
      // Para filtro urgente, obtenemos todos los datos y filtramos en frontend
      // para asegurar que solo mostramos tareas urgentes NO completadas
      this.setLoading(true);
      this.todoApiService.getAllTodos({ filter: 'urgent' }).subscribe({
        next: (todos) => {
          // Filtro adicional en frontend para mayor robustez
          // Solo mostramos tareas urgentes que realmente requieren atención (no completadas)
          const urgentNotCompleted = TodoUtils.filterActivelyUrgent(todos);
          this.updateState({ todos: urgentNotCompleted, error: null });
        },
        error: (error) => {
          this.updateState({ error: error.message });
          this.setLoading(false);
        },
        complete: () => {
          this.setLoading(false);
        }
      });
    } else {
      // Para otros filtros, usar la lógica normal
      this.loadTodos(filterParam ? { filter: filterParam } : undefined);
    }
  }

  loadTodosByCategory(category: string): void {
    this.loadTodos({ category });
  }

  loadTodosByPriority(priority: string): void {
    this.loadTodos({ priority });
  }

  getTodoStats(): Observable<TodoStats> {
    return this.todoApiService.getTodoStats();
  }

  /**
   * Observable que se emite cuando las estadísticas necesitan ser refrescadas
   */
  getStatsRefreshTrigger(): Observable<void> {
    return this.refreshStatsSubject.asObservable();
  }

  /**
   * Refresca tanto la lista de tareas como las estadísticas
   * Útil después de operaciones que modifican los datos
   */
  private refreshDataAfterOperation(): void {
    const currentState = this.state.value;
    const currentFilter = currentState.currentFilter || 'all';
    
    console.log('🔄 Refreshing data after operation, filter:', currentFilter);
    
    // Refrescar la lista de tareas manteniendo el filtro actual
    this.loadTodosByFilter(currentFilter);
    
    // Notificar que las estadísticas necesitan refrescarse
    console.log('📊 Triggering stats refresh');
    this.refreshStatsSubject.next();
  }

  createTodo(todo: CreateTodoDto): void {
    this.setLoading(true);
    this.todoApiService.createTodo(todo).subscribe({
      next: (newTodo) => {
        // Refrescar datos para mantener consistencia con filtros y estadísticas
        this.refreshDataAfterOperation();
        // El loading se maneja en refreshDataAfterOperation -> loadTodosByFilter
      },
      error: (error) => {
        this.updateState({ error: error.message });
        this.setLoading(false);
      }
      // No ponemos complete aquí porque el loading se maneja en refreshDataAfterOperation
    });
  }

  updateTodo(todo: UpdateTodoDto): void {
    this.setLoading(true);
    this.todoApiService.updateTodo(todo).subscribe({
      next: (updatedTodo) => {
        // Refrescar datos para mantener consistencia con filtros y estadísticas
        this.refreshDataAfterOperation();
        // El loading se maneja en refreshDataAfterOperation -> loadTodosByFilter
      },
      error: (error) => {
        this.updateState({ error: error.message });
        this.setLoading(false);
      }
      // No ponemos complete aquí porque el loading se maneja en refreshDataAfterOperation
    });
  }

  deleteTodo(id: string): void {
    this.setLoading(true);
    this.todoApiService.deleteTodo(id).subscribe({
      next: () => {
        // Refrescar datos para mantener consistencia con filtros y estadísticas
        this.refreshDataAfterOperation();
        // El loading se maneja en refreshDataAfterOperation -> loadTodosByFilter
      },
      error: (error) => {
        this.updateState({ error: error.message });
        this.setLoading(false);
      }
      // No ponemos complete aquí porque el loading se maneja en refreshDataAfterOperation
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
