import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EscuelaService } from '../core/escuela.service';
import { FacultadService } from '../core/facultad.service';
import { Escuela, Facultad } from '../core/models';

@Component({
  selector: 'app-escuelas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './escuelas.html',
})
export class Escuelas implements OnInit {

  private readonly escuelaService = inject(EscuelaService);
  private readonly facultadService = inject(FacultadService);
  private readonly cdr = inject(ChangeDetectorRef);

  escuelas: Escuela[] = [];
  facultades: Facultad[] = [];

  nuevaEscuela: Escuela = { nombre: '', facultadId: 0 };
  escuelaEdicion: Escuela | null = null;
  mostrarModal = false;

  mensaje = '';
  error = '';
  errorModal = '';

  ngOnInit(): void {
    this.cargarEscuelas();
    this.cargarFacultades();
  }

  cargarEscuelas(): void {
    this.escuelaService.listar().subscribe({
      next: (data) => {
        this.escuelas = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar escuelas';
        this.cdr.detectChanges();
      }
    });
  }

  cargarFacultades(): void {
    this.facultadService.listar().subscribe({
      next: (data) => {
        this.facultades = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar facultades';
        this.cdr.detectChanges();
      }
    });
  }

  obtenerNombreFacultad(facultadId: number): string {
    const fac = this.facultades.find(f => f.id === facultadId);
    return fac ? fac.nombre : 'Desconocida';
  }

  abrirModal(): void {
    this.escuelaEdicion = null;
    this.nuevaEscuela = { nombre: '', facultadId: 0 };
    this.errorModal = '';
    this.mostrarModal = true;
  }

  abrirEdicion(escuela: Escuela): void {
    this.escuelaEdicion = { ...escuela };
    this.errorModal = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.escuelaEdicion = null;
    this.errorModal = '';
  }

  guardar(): void {
    this.errorModal = '';
    if (!this.nuevaEscuela.nombre.trim()) {
      this.errorModal = 'El nombre es obligatorio';
      return;
    }
    if (!this.nuevaEscuela.facultadId) {
      this.errorModal = 'Debe seleccionar una facultad';
      return;
    }

    this.escuelaService.crear(this.nuevaEscuela).subscribe({
      next: () => {
        this.mensaje = 'Escuela creada con éxito';
        this.mostrarModal = false;
        this.nuevaEscuela = { nombre: '', facultadId: 0 };
        this.cargarEscuelas();
      },
      error: (err) => {
        this.errorModal = err.error?.message || 'Error al guardar escuela';
        this.cdr.detectChanges();
      }
    });
  }

  actualizar(): void {
    this.errorModal = '';
    if (!this.escuelaEdicion || !this.escuelaEdicion.id) return;
    if (!this.escuelaEdicion.nombre.trim()) {
      this.errorModal = 'El nombre es obligatorio';
      return;
    }
    if (!this.escuelaEdicion.facultadId) {
      this.errorModal = 'Debe seleccionar una facultad';
      return;
    }

    this.escuelaService.actualizar(this.escuelaEdicion.id, this.escuelaEdicion).subscribe({
      next: () => {
        this.mensaje = 'Escuela actualizada con éxito';
        this.mostrarModal = false;
        this.escuelaEdicion = null;
        this.cargarEscuelas();
      },
      error: (err) => {
        this.errorModal = err.error?.message || 'Error al actualizar escuela';
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Está seguro de eliminar esta escuela?')) return;
    this.mensaje = '';
    this.error = '';

    this.escuelaService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Escuela eliminada con éxito';
        this.cargarEscuelas();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al eliminar escuela';
        this.cdr.detectChanges();
      }
    });
  }
}
