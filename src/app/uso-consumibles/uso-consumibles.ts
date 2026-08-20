import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsoService, UsoConsumibleRequestDTO, UsoConsumibleResponseDTO } from '../core/uso.service';
import { ConsumibleService, Consumible } from '../core/consumible.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-uso-consumibles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './uso-consumibles.html'
})
export class UsoConsumibles implements OnInit {
  private readonly usoService = inject(UsoService);
  private readonly consumibleService = inject(ConsumibleService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly authService = inject(AuthService);

  consumibles: Consumible[] = [];
  usos: UsoConsumibleResponseDTO[] = [];
  mostrarFormulario = false;
  guardando = false;
  
  uso: UsoConsumibleRequestDTO = {
    consumibleId: null,
    nombreInvestigador: '',
    tipoInvestigacion: '',
    actividadNombre: '',
    cantidad: null,
    fecha: '',
    hora: '',
    observacion: ''
  };

  usoEditandoId: number | null = null;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  ngOnInit() {
    this.cargarConsumibles();
    this.cargarUsos();
  }

  cargarConsumibles() {
    this.consumibleService.listar().subscribe({
      next: (data) => {
        this.consumibles = data;
        this.cdr.detectChanges();
      },
      error: () => console.error('Error cargando consumibles')
    });
  }

  cargarUsos() {
    this.usoService.obtenerUsosConsumible().subscribe({
      next: (data) => {
        this.usos = data;
        this.cdr.detectChanges();
      },
      error: () => console.error('Error cargando usos de consumibles')
    });
  }

  abrirFormulario() {
    this.limpiarFormulario();
    this.usoEditandoId = null;
    this.guardando = false;
    this.mostrarFormulario = true;
  }

  abrirFormularioEdicion(registro: UsoConsumibleResponseDTO) {
    this.uso = {
      consumibleId: registro.consumibleId,
      nombreInvestigador: registro.nombreInvestigador || '',
      tipoInvestigacion: registro.tipoInvestigacion,
      actividadNombre: registro.actividadNombre,
      cantidad: registro.cantidad,
      fecha: registro.fecha,
      hora: registro.hora,
      observacion: registro.observacion
    };
    this.usoEditandoId = registro.id;
    this.guardando = false;
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.guardando = false;
  }

  guardarUso() {
    if (this.guardando) return;
    this.mensajeExito = null;
    this.mensajeError = null;
    this.guardando = true;
    this.cdr.detectChanges();
    
    if (this.usoEditandoId) {
      this.usoService.editarUsoConsumible(this.usoEditandoId, this.uso).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeExito = 'El uso del consumible fue actualizado exitosamente.';
          this.cerrarFormulario();
          this.cargarUsos();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.guardando = false;
          console.error(err);
          this.mensajeError = err.error?.message || 'Error al actualizar el registro.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.usoService.registrarUsoConsumible(this.uso).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeExito = 'El uso del consumible fue registrado exitosamente.';
          this.cerrarFormulario();
          this.cargarUsos();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.guardando = false;
          console.error(err);
          this.mensajeError = err.error?.message || 'Ocurrió un error al registrar el uso.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminarUso(id: number) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.usoService.eliminarUsoConsumible(id).subscribe({
        next: () => {
          this.mensajeExito = 'Registro eliminado exitosamente.';
          this.cargarUsos();
        },
        error: () => {
          this.mensajeError = 'Error al eliminar el registro.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  limpiarFormulario() {
    this.uso = {
      consumibleId: null,
      nombreInvestigador: '',
      tipoInvestigacion: '',
      actividadNombre: '',
      cantidad: null,
      fecha: '',
      hora: '',
      observacion: ''
    };
  }
}


