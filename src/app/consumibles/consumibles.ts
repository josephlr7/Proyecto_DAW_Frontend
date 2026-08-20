import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsumibleService, Consumible } from '../core/consumible.service';
import { LaboratorioService } from '../core/laboratorio.service';
import { Laboratorio } from '../core/models';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-consumibles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consumibles.html',
})
export class Consumibles implements OnInit {

  private readonly consumibleService = inject(ConsumibleService);
  private readonly laboratorioService = inject(LaboratorioService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly authService = inject(AuthService);

  consumibles: Consumible[] = [];
  laboratorios: Laboratorio[] = [];

  nuevoConsumible: Consumible = {
    nombre: '',
    marca: '',
    empresa: '',
    estadoAdquirido: 'NUEVO',
    tipo: 'REACTIVO',
    unidadMedida: 'unidades',
    funcion: '',
    rangoPrecio: '',
    fechaAdquisicion: new Date().toISOString().substring(0, 10),
    fechaVencimiento: '',
    cantidad: 0,
    stockMinimo: 0,
    laboratorioId: 0
  };

  consumibleEdicion: Consumible | null = null;
  mostrarFormularioNueva = false;

  mensaje = '';
  error = '';

  ngOnInit(): void {
    this.cargarConsumibles();
    this.cargarLaboratorios();
  }

  cargarConsumibles(): void {
    this.consumibleService.listar().subscribe({
      next: (data) => {
        this.consumibles = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar consumibles';
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
    this.consumibleEdicion = null;
    this.nuevoConsumible = {
      nombre: '',
      marca: '',
      empresa: '',
      estadoAdquirido: 'NUEVO',
      tipo: 'REACTIVO',
      unidadMedida: 'unidades',
      funcion: '',
      rangoPrecio: '',
      fechaAdquisicion: new Date().toISOString().substring(0, 10),
      fechaVencimiento: '',
      cantidad: 0,
      stockMinimo: 0,
      laboratorioId: 0
    };
  }

  cancelarCrear(): void {
    this.mostrarFormularioNueva = false;
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.nuevoConsumible.nombre || !this.nuevoConsumible.marca || !this.nuevoConsumible.laboratorioId) {
      this.error = 'Complete los campos obligatorios';
      return;
    }

    this.consumibleService.crear(this.nuevoConsumible).subscribe({
      next: () => {
        this.mensaje = 'Consumible registrado con éxito';
        this.mostrarFormularioNueva = false;
        this.cargarConsumibles();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al guardar consumible';
      }
    });
  }

  editar(consumible: Consumible): void {
    this.consumibleEdicion = { ...consumible };
    this.mostrarFormularioNueva = false;
  }

  cancelarEdicion(): void {
    this.consumibleEdicion = null;
  }

  actualizar(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.consumibleEdicion || !this.consumibleEdicion.id) return;

    this.consumibleService.actualizar(this.consumibleEdicion.id, this.consumibleEdicion).subscribe({
      next: () => {
        this.mensaje = 'Consumible actualizado con éxito';
        this.consumibleEdicion = null;
        this.cargarConsumibles();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al actualizar consumible';
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Está seguro de eliminar este consumible?')) return;
    this.mensaje = '';
    this.error = '';

    this.consumibleService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Consumible eliminado con éxito';
        this.cargarConsumibles();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al eliminar consumible';
      }
    });
  }
}
