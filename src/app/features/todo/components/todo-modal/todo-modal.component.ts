import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo } from '@features/todo/models/todo.model';

@Component({
  selector: 'app-todo-modal',
  templateUrl: './todo-modal.component.html',
  styleUrls: ['./todo-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TodoModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() todo: Todo | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Todo>();

  todoForm!: FormGroup;
  categories = [
    { id: 'frontend', name: 'Frontend', color: '#ff6b6b', icon: '🎨' },
    { id: 'backend', name: 'Backend', color: '#4ecdc4', icon: '⚙️' },
    { id: 'database', name: 'Database', color: '#45b7d1', icon: '🗄️' },
    { id: 'testing', name: 'Testing', color: '#96ceb4', icon: '🧪' },
    { id: 'devops', name: 'DevOps', color: '#ffeaa7', icon: '🚀' },
    { id: 'documentation', name: 'Documentation', color: '#dda0dd', icon: '📝' },
    { id: 'bugfix', name: 'Bug Fix', color: '#ff7675', icon: '🐛' },
    { id: 'feature', name: 'Feature', color: '#00b894', icon: '✨' },
    { id: 'security', name: 'Security', color: '#e17055', icon: '🔒' },
    { id: 'performance', name: 'Performance', color: '#fdcb6e', icon: '⚡' }
  ];

  priorities = [
    { id: 'low', name: 'Baja', color: '#6B7280' },
    { id: 'medium', name: 'Media', color: '#F59E0B' },
    { id: 'high', name: 'Alta', color: '#EF4444' },
    { id: 'urgent', name: 'Urgente', color: '#DC2626' }
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    // La población del form se maneja en ngOnChanges
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cuando cambian los datos de entrada
    if (changes['todo'] && this.todoForm) {
      if (this.todo && this.mode === 'edit') {
        this.populateForm();
      } else if (this.mode === 'create') {
        this.resetForm();
      }
    }
    
    // También revisar cuando cambia el modo
    if (changes['mode'] && this.todoForm) {
      if (this.mode === 'edit' && this.todo) {
        this.populateForm();
      } else if (this.mode === 'create') {
        this.resetForm();
      }
    }
  }

  private initForm(): void {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      category: ['feature'], // Cambio del valor por defecto
      priority: ['medium'],
      dueDate: [''],
      completed: [false]
    });
  }

  private populateForm(): void {
    if (this.todo) {
      console.log('Populating form with todo:', this.todo); // Debug log
      const formData = {
        title: this.todo.title,
        description: this.todo.description || '',
        category: this.todo.category || 'feature',
        priority: this.todo.priority || 'medium',
        dueDate: this.todo.dueDate || '',
        completed: this.todo.completed
      };
      console.log('Form data to patch:', formData); // Debug log
      this.todoForm.patchValue(formData);
      console.log('Form value after patch:', this.todoForm.value); // Debug log
    }
  }

  onClose(): void {
    this.close.emit();
    this.resetForm();
  }

  onSave(): void {
    if (this.todoForm.valid) {
      const formValue = this.todoForm.value;
      const todoData: Todo = {
        id: this.todo?.id,
        title: formValue.title,
        description: formValue.description,
        completed: formValue.completed,
        category: formValue.category,
        priority: formValue.priority,
        dueDate: formValue.dueDate
      };

      this.save.emit(todoData);
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.todoForm.reset({
      title: '',
      description: '',
      category: 'feature',
      priority: 'medium',
      dueDate: '',
      completed: false
    });
  }

  get titleControl() {
    return this.todoForm.get('title');
  }

  get descriptionControl() {
    return this.todoForm.get('description');
  }

  getModalTitle(): string {
    return this.mode === 'create' ? 'Nueva Tarea' : 'Editar Tarea';
  }

  getSaveButtonText(): string {
    return this.mode === 'create' ? 'Crear Tarea' : 'Guardar Cambios';
  }
}
