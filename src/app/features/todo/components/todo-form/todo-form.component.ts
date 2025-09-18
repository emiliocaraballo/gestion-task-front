import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Todo } from '@features/todo/models/todo.model';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TodoFormComponent {
  @Output() todoCreated = new EventEmitter<Todo>();
  
  todoForm: FormGroup = this.initForm();

  constructor(private fb: FormBuilder) {}

  private initForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      completed: [false]
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.todoCreated.emit(this.todoForm.value);
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.todoForm.reset({
      title: '',
      description: '',
      completed: false
    });
  }

  get titleControl() {
    return this.todoForm.get('title');
  }
}