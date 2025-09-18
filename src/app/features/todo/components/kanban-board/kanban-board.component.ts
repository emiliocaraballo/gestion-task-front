import { Component, EventEmitter, Input, OnInit, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Todo, TodoStatus } from '@features/todo/models/todo.model';

interface KanbanColumn {
  id: string;
  title: string;
  status: TodoStatus;
  color: string;
  icon: string;
  tasks: Todo[];
}

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  standalone: true,
  imports: [CommonModule, DragDropModule]
})
export class KanbanBoardComponent implements OnInit, OnChanges {
  @Input() todos: Todo[] = [];
  @Output() todoUpdated = new EventEmitter<Todo>();
  @Output() todoEdit = new EventEmitter<Todo>();

  columns: KanbanColumn[] = [
    {
      id: 'pending',
      title: 'Por Hacer',
      status: 'pending',
      color: '#6B7280',
      icon: '📋',
      tasks: []
    },
    {
      id: 'in_progress',
      title: 'En Progreso',
      status: 'in_progress',
      color: '#3B82F6',
      icon: '⚡',
      tasks: []
    },
    {
      id: 'completed',
      title: 'Completado',
      status: 'completed',
      color: '#10B981',
      icon: '✅',
      tasks: []
    },
    {
      id: 'rejected',
      title: 'Rechazado',
      status: 'rejected',
      color: '#EF4444',
      icon: '❌',
      tasks: []
    }
  ];

  ngOnInit(): void {
    this.organizeTasks();
  }

  ngOnChanges(): void {
    this.organizeTasks();
  }

  private organizeTasks(): void {
    // Reset all columns
    this.columns.forEach(column => column.tasks = []);

    // Organize tasks by their status field or fallback to completed field
    this.todos.forEach(todo => {
      let targetColumnId: string;
      
      if (todo.status) {
        // Use the status field from backend
        targetColumnId = todo.status;
      } else {
        // Fallback to completed field for compatibility
        targetColumnId = todo.completed ? 'completed' : 'pending';
      }
      
      const targetColumn = this.columns.find(col => col.id === targetColumnId);
      if (targetColumn) {
        targetColumn.tasks.push(todo);
      } else {
        // If status doesn't match any column, put in pending
        this.columns.find(col => col.id === 'pending')?.tasks.push(todo);
      }
    });
  }

  onDrop(event: CdkDragDrop<Todo[]>): void {
    if (event.previousContainer === event.container) {
      // Moving within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving between columns
      const task = event.previousContainer.data[event.previousIndex];
      const targetColumnId = event.container.id as TodoStatus;
      
      // Update task status based on target column
      const updatedTask: Todo = {
        ...task,
        status: targetColumnId,
        completed: targetColumnId === 'completed' // Sync completed field for compatibility
      };

      // Move the item
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update the task in the new column
      event.container.data[event.currentIndex] = updatedTask;

      // Emit the updated task
      this.todoUpdated.emit(updatedTask);
    }
  }

  onEditTask(task: Todo): void {
    this.todoEdit.emit(task);
  }

  getColumnConnectedTo(): string[] {
    return this.columns.map(col => col.id);
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent': return '#DC2626';
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'frontend': '🎨',
      'backend': '⚙️',
      'database': '🗄️',
      'testing': '🧪',
      'devops': '🚀',
      'documentation': '📝',
      'bugfix': '🐛',
      'feature': '✨',
      'security': '🔒',
      'performance': '⚡'
    };
    return icons[category] || '📋';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  }

  isOverdue(task: Todo): boolean {
    if (!task.dueDate || task.completed) return false;
    try {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate.getTime() < today.getTime();
    } catch {
      return false;
    }
  }
}
