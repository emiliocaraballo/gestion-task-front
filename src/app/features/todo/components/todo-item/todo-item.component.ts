import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '@features/todo/models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() todoUpdated = new EventEmitter<Todo>();
  @Output() todoDeleted = new EventEmitter<string>();

  onToggleComplete(): void {
    this.todoUpdated.emit({
      ...this.todo,
      completed: !this.todo.completed
    });
  }

  onDelete(): void {
    if (this.todo.id) {
      this.todoDeleted.emit(this.todo.id);
    }
  }
}