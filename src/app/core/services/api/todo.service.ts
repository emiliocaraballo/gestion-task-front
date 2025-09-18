import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../config/api.config';
import { 
  Todo, 
  CreateTodoDto, 
  UpdateTodoDto 
} from '../../../features/todo/models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoApiService {
  private apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.todos}`;

  constructor(private http: HttpClient) {}

  getAllTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: CreateTodoDto): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo);
  }

  updateTodo(todo: UpdateTodoDto): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo);
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
