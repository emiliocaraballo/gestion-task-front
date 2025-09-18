import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo, TodoUtils } from '@features/todo/models/todo.model';

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
  @Output() todoEdit = new EventEmitter<Todo>();


  onToggleComplete(): void {
    this.todoUpdated.emit({
      ...this.todo,
      completed: !this.todo.completed
    });
  }

  onEdit(): void {
    this.todoEdit.emit(this.todo);
  }

  onDelete(): void {
    if (this.todo.id) {
      this.todoDeleted.emit(this.todo.id);
    }
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'low': '🟢 Baja',
      'medium': '🟡 Media',
      'high': '🟠 Alta',
      'urgent': '🔴 Urgente'
    };
    return labels[priority] || labels['medium'];
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'frontend': '🎨 Frontend',
      'backend': '⚙️ Backend',
      'database': '🗄️ Database',
      'testing': '🧪 Testing',
      'devops': '🚀 DevOps',
      'documentation': '📝 Docs',
      'bugfix': '🐛 Bug Fix',
      'feature': '✨ Feature',
      'security': '🔒 Security',
      'performance': '⚡ Performance'
    };
    return labels[category] || labels['feature'];
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return 'Hoy';
      } else if (diffDays === 1) {
        return 'Mañana';
      } else if (diffDays === -1) {
        return 'Ayer';
      } else if (diffDays > 1) {
        return `En ${diffDays} días`;
      } else {
        return `Hace ${Math.abs(diffDays)} días`;
      }
    } catch (error) {
      return dateString;
    }
  }

  getRelativeTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      if (diffDays > 0) {
        return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
      } else if (diffHours > 0) {
        return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      } else if (diffMinutes > 0) {
        return `hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
      } else {
        return 'recién creada';
      }
    } catch (error) {
      return 'fecha desconocida';
    }
  }

  isOverdue(): boolean {
    if (!this.todo.dueDate || this.todo.completed) {
      return false;
    }
    try {
      const dueDate = new Date(this.todo.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate.getTime() < today.getTime();
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica si esta tarea es activamente urgente (prioridad alta/urgente Y no completada)
   */
  isActivelyUrgent(): boolean {
    return TodoUtils.isActivelyUrgent(this.todo);
  }

}