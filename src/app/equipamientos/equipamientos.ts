import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipamientoService, Equipamiento } from '../core/equipamiento.service';
import { LaboratorioService } from '../core/laboratorio.service';
import { Laboratorio } from '../core/models';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-equipamientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipamientos.html',
})
export class Equipamientos implements OnInit {

  private readonly equipamientoService = inject(EquipamientoService);
  private readonly laboratorioService = inject(LaboratorioService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly authService = inject(AuthService);

  equipos: Equipamiento[] = [];
  laboratorios: Laboratorio[] = [];

  nuevoEquipo: Equipamiento = {
    nombre: '',
    funcion: '',
    rangoPrecio: '',
    anoAdquisicion: new Date().getFullYear(),
    horasUso: 0,
    estado: 'OPERATIVO',
    programaMantenimiento: 'TRIMESTRAL',
    programaMantenimientoHoras: 100,
    requiereConsumible: false,
    tipoConsumibleRequerido: '',
    laboratorioId: 0
  };

  equipoEdicion: Equipamiento | null = null;
  mostrarFormularioNueva = false;
  guardando = false;

  mensaje = '';
  error = '';

  ngOnInit(): void {
    this.cargarEquipos();
    this.cargarLaboratorios();
  }

  cargarEquipos(): void {
    this.equipamientoService.listar().subscribe({
      next: (data) => {
        this.equipos = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar equipos';
        this.cdr.detectChanges();
      }
    });
  }

  cargarLaboratorios(): void {
    this.laboratorioService.consultar(null, null, 0, 50).subscribe({
      next: (data) => {
        this.laboratorios = data.content || [];
        this.cdr.detectChanges();
      }
    });
  }

  obtenerNombreLaboratorio(labId: number): string {
    const lab = this.laboratorios.find(l => l.id === labId);
    return lab ? `${lab.escuela}` : `Laboratorio #${labId}`;
  }

  abrirCrear(): void {
    this.mostrarFormularioNueva = true;
    this.equipoEdicion = null;
    this.guardando = false;
    this.nuevoEquipo = {
      nombre: '',
      funcion: '',
      rangoPrecio: '',
      anoAdquisicion: new Date().getFullYear(),
      horasUso: 0,
      estado: 'OPERATIVO',
      programaMantenimiento: 'TRIMESTRAL',
      programaMantenimientoHoras: 100,
      requiereConsumible: false,
      tipoConsumibleRequerido: '',
      laboratorioId: 0
    };
  }

  cancelarCrear(): void {
    this.mostrarFormularioNueva = false;
    this.guardando = false;
  }

  guardar(): void {
    if (this.guardando) return;
    this.mensaje = '';
    this.error = '';

    if (!this.nuevoEquipo.nombre || !this.nuevoEquipo.funcion || !this.nuevoEquipo.laboratorioId) {
      this.error = 'Complete los campos obligatorios';
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    this.equipamientoService.crear(this.nuevoEquipo).subscribe({
      next: () => {
        this.guardando = false;
        this.mensaje = 'Equipo registrado con éxito';
        this.mostrarFormularioNueva = false;
        this.cargarEquipos();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.guardando = false;
        this.error = err.error?.message || 'Error al guardar equipo';
        this.cdr.detectChanges();
      }
    });
  }

  editar(equipo: Equipamiento): void {
    this.equipoEdicion = { ...equipo };
    this.mostrarFormularioNueva = false;
    this.guardando = false;
  }

  cancelarEdicion(): void {
    this.equipoEdicion = null;
    this.guardando = false;
  }

  actualizar(): void {
    if (this.guardando) return;
    this.mensaje = '';
    this.error = '';

    if (!this.equipoEdicion || !this.equipoEdicion.id) return;

    this.guardando = true;
    this.cdr.detectChanges();

    this.equipamientoService.actualizar(this.equipoEdicion.id, this.equipoEdicion).subscribe({
      next: () => {
        this.guardando = false;
        this.mensaje = 'Equipo actualizado con éxito';
        this.equipoEdicion = null;
        this.cargarEquipos();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.guardando = false;
        this.error = err.error?.message || 'Error al actualizar equipo';
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Está seguro de eliminar este equipo?')) return;
    this.mensaje = '';
    this.error = '';

    this.equipamientoService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Equipo eliminado con éxito';
        this.cargarEquipos();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al eliminar equipo';
      }
    });
  }
}
