import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacultadService } from '../core/facultad.service';
import { Facultad } from '../core/models';

@Component({
  selector: 'app-facultades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facultades.html',
})
export class Facultades implements OnInit {

  private readonly facultadService = inject(FacultadService);
  private readonly cdr = inject(ChangeDetectorRef);

  facultades: Facultad[] = [];
  nuevaFacultad: Facultad = { nombre: '' };
  facultadEdicion: Facultad | null = null;
  mostrarModal = false;
  mensaje = '';
  error = '';

  ngOnInit(): void {
    this.cargarFacultades();
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

  abrirModal(): void {
    this.facultadEdicion = null;
    this.nuevaFacultad = { nombre: '' };
    this.mensaje = '';
    this.error = '';
    this.mostrarModal = true;
  }

  abrirEdicion(facultad: Facultad): void {
    this.facultadEdicion = { ...facultad };
    this.mensaje = '';
    this.error = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.facultadEdicion = null;
  }

  guardar(): void {
    this.error = '';
    if (!this.nuevaFacultad.nombre.trim()) {
      this.error = 'El nombre es obligatorio';
      return;
    }

    this.facultadService.crear(this.nuevaFacultad).subscribe({
      next: () => {
        this.mensaje = 'Facultad creada con éxito';
        this.mostrarModal = false;
        this.nuevaFacultad = { nombre: '' };
        this.cargarFacultades();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al guardar facultad';
        this.cdr.detectChanges();
      }
    });
  }

  actualizar(): void {
    this.error = '';
    if (!this.facultadEdicion || !this.facultadEdicion.id) return;
    if (!this.facultadEdicion.nombre.trim()) {
      this.error = 'El nombre es obligatorio';
      return;
    }

    this.facultadService.actualizar(this.facultadEdicion.id, this.facultadEdicion).subscribe({
      next: () => {
        this.mensaje = 'Facultad actualizada con éxito';
        this.mostrarModal = false;
        this.facultadEdicion = null;
        this.cargarFacultades();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al actualizar facultad';
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Está seguro de eliminar esta facultad?')) return;
    this.mensaje = '';
    this.error = '';

    this.facultadService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Facultad eliminada con éxito';
        this.cargarFacultades();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al eliminar facultad';
        this.cdr.detectChanges();
      }
    });
  }
}
