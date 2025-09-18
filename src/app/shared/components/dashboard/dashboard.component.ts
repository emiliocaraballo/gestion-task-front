import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, timer, merge, switchMap, takeUntil, startWith, map } from 'rxjs';
import { TodoFacadeService } from '../../../features/todo/services/todo-facade.service';
import { TodoStats } from '../../../features/todo/models/todo-stats.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit, OnDestroy {
  todoStats$: Observable<TodoStats>;
  private destroy$ = new Subject<void>();

  constructor(private todoFacade: TodoFacadeService) {
    // Configurar estadísticas que se refrescan inmediatamente después de operaciones
    // y también periódicamente como respaldo
    this.todoStats$ = merge(
      timer(0, 5000).pipe(map(() => 'timer')), // Cada 5 segundos como respaldo
      this.todoFacade.getStatsRefreshTrigger().pipe(map(() => 'trigger')) // Inmediatamente después de operaciones
    ).pipe(
      startWith('initial'),
      switchMap((source) => {
        console.log('📈 Dashboard getting stats from source:', source);
        return this.todoFacade.getTodoStats();
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit(): void {
    // Las estadísticas se cargan automáticamente via Observable
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCurrentDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('es-ES', options);
  }
}
