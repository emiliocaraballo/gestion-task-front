import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent {
  @Output() createTask = new EventEmitter<void>();

  onCreateTaskClick(): void {
    this.createTask.emit();
  }
}
