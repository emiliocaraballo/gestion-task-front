export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export interface TodoStatusInfo {
  value: TodoStatus;
  displayName: string;
  icon: string;
  color: string;
}

export const TODO_STATUSES: Record<TodoStatus, TodoStatusInfo> = {
  pending: { value: 'pending', displayName: 'Por Hacer', icon: '📋', color: '#6B7280' },
  in_progress: { value: 'in_progress', displayName: 'En Progreso', icon: '⚡', color: '#3B82F6' },
  completed: { value: 'completed', displayName: 'Completado', icon: '✅', color: '#10B981' },
  rejected: { value: 'rejected', displayName: 'Rechazado', icon: '❌', color: '#EF4444' }
};

export interface Todo {
  id?: string;
  title: string;
  description: string;
  status?: TodoStatus;
  completed: boolean; // Mantenemos para compatibilidad
  category?: string;
  priority?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TodoState {
  todos: Todo[];
  selectedTodo: Todo | null;
  loading: boolean;
  error: string | null;
  currentFilter?: 'all' | 'pending' | 'completed' | 'urgent';
}

export interface CreateTodoDto {
  title: string;
  description: string;
  status?: TodoStatus;
  completed: boolean;
  category?: string;
  priority?: string;
  dueDate?: string;
}

export interface UpdateTodoDto extends Partial<CreateTodoDto> {
  id: string;
}

// Utility functions para validaciones de tareas
export const TodoUtils = {
  /**
   * Verifica si una tarea es realmente urgente (prioridad alta/urgente Y no completada)
   */
  isActivelyUrgent(todo: Todo): boolean {
    return (todo.priority === 'high' || todo.priority === 'urgent') && !todo.completed;
  },

  /**
   * Filtra una lista de tareas para obtener solo las urgentes activas
   */
  filterActivelyUrgent(todos: Todo[]): Todo[] {
    return todos.filter(this.isActivelyUrgent);
  }
};
