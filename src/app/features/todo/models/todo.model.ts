export interface Todo {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface TodoState {
  todos: Todo[];
  selectedTodo: Todo | null;
  loading: boolean;
  error: string | null;
}

export interface CreateTodoDto {
  title: string;
  description: string;
  completed: boolean;
}

export interface UpdateTodoDto extends Partial<CreateTodoDto> {
  id: string;
}
