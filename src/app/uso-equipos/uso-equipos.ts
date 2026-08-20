import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsoService, UsoEquipamientoRequestDTO, UsoEquipamientoResponseDTO } from '../core/uso.service';
import { EquipamientoService, Equipamiento } from '../core/equipamiento.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-uso-equipos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './uso-equipos.html'
})
export class UsoEquipos implements OnInit {
  private readonly usoService = inject(UsoService);
  private readonly equipamientoService = inject(EquipamientoService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly authService = inject(AuthService);

  equipamientos: Equipamiento[] = [];
  usos: UsoEquipamientoResponseDTO[] = [];
  mostrarFormulario = false;
  guardando = false;
  
  uso: UsoEquipamientoRequestDTO = {
    equipamientoId: null,
    nombreInvestigador: '',
    tipoInvestigacion: '',
    actividadNombre: '',
    horasUso: null,
    fecha: '',
    hora: '',
    observacion: ''
  };

  usoEditandoId: number | null = null;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  ngOnInit() {
    this.cargarEquipamientos();
    this.cargarUsos();
  }

  cargarEquipamientos() {
    this.equipamientoService.listar().subscribe({
      next: (data) => {
        this.equipamientos = data;
        this.cdr.detectChanges();
      },
      error: () => console.error('Error cargando equipamientos')
    });
  }

  cargarUsos() {
    this.usoService.obtenerUsosEquipamiento().subscribe({
      next: (data) => {
        this.usos = data;
        this.cdr.detectChanges();
      },
      error: () => console.error('Error cargando usos de equipos')
    });
  }

  abrirFormulario() {
    this.limpiarFormulario();
    this.usoEditandoId = null;
    this.guardando = false;
    this.mostrarFormulario = true;
  }

  abrirFormularioEdicion(registro: UsoEquipamientoResponseDTO) {
    this.uso = {
      equipamientoId: registro.equipamientoId,
      nombreInvestigador: registro.nombreInvestigador || '',
      tipoInvestigacion: registro.tipoInvestigacion,
      actividadNombre: registro.actividadNombre,
      horasUso: registro.horasUso,
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
      this.usoService.editarUsoEquipamiento(this.usoEditandoId, this.uso).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeExito = 'El uso del equipo fue actualizado exitosamente.';
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
      this.usoService.registrarUsoEquipamiento(this.uso).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeExito = 'El uso del equipo fue registrado exitosamente.';
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
      this.usoService.eliminarUsoEquipamiento(id).subscribe({
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
      equipamientoId: null,
      nombreInvestigador: '',
      tipoInvestigacion: '',
      actividadNombre: '',
      horasUso: null,
      fecha: '',
      hora: '',
      observacion: ''
    };
  }
}


