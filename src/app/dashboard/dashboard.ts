import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  stats = {
    usuarios: 0,
    personal: 0,
    laboratorios: 0,
    facultades: 0,
    escuelas: 0,
    equipamientos: 0,
    consumibles: 0,
    usosEquipos: 0,
    usosConsumibles: 0
  };

  errorMsg: string | null = null;

  ngOnInit() {
    this.cargarStats();
  }

  cargarStats() {
    const token = this.authService.obtenerToken();
    if (!token) return;

    this.http.get<any>('/api/dashboard/stats').subscribe({
      next: (data) => {
        this.stats = data;
        this.errorMsg = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando estadísticas del dashboard', err);
        this.errorMsg = 'No se pudieron cargar las estadísticas.';
        this.cdr.detectChanges();
      }
    });
  }
}

