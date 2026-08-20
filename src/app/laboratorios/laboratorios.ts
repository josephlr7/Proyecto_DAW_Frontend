import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LaboratorioService } from '../core/laboratorio.service';
import { FacultadService } from '../core/facultad.service';
import { EscuelaService } from '../core/escuela.service';
import { Laboratorio, Facultad, Escuela } from '../core/models';

@Component({
  selector: 'app-laboratorios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './laboratorios.html',
})
export class Laboratorios implements OnInit {

  private readonly laboratorioService = inject(LaboratorioService);
  private readonly facultadService = inject(FacultadService);
  private readonly escuelaService = inject(EscuelaService);
  private readonly cdr = inject(ChangeDetectorRef);

  laboratorios: Laboratorio[] = [];
  facultades: Facultad[] = [];
  escuelas: Escuela[] = [];
  escuelasFiltradas: Escuela[] = [];

  // Búsqueda y paginación
  facultadBusqueda = '';
  escuelaBusqueda = '';
  paginaActual = 0;
  tamanoPagina = 5;
  totalElementos = 0;
  totalPaginas = 0;

  // Formulario
  nuevoLaboratorio: Laboratorio = {
    facultad: '',
    escuela: '',
    poseeSistemaGestion: false
  };

  laboratorioEdicion: Laboratorio | null = null;
  escuelasFormulario: Escuela[] = [];

  mensaje = '';
  error = '';
  mostrarFormularioNueva = false;

  ngOnInit(): void {
    this.cargarLaboratorios();
    this.cargarFacultadesYEscuelas();
  }

  cargarLaboratorios(): void {
    this.laboratorioService
      .consultar(
        this.facultadBusqueda || null,
        this.escuelaBusqueda || null,
        this.paginaActual,
        this.tamanoPagina
      )
      .subscribe({
        next: (data) => {
          this.laboratorios = data.content || [];
          this.totalElementos = data.totalElements || 0;
          this.totalPaginas = data.totalPages || 0;
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'Error al cargar los laboratorios';
          this.cdr.detectChanges();
        }
      });
  }

  cargarFacultadesYEscuelas(): void {
    this.facultadService.listar().subscribe({
      next: (data) => {
        this.facultades = data;
        this.cdr.detectChanges();
      }
    });

    this.escuelaService.listar().subscribe({
      next: (data) => {
        this.escuelas = data;
        this.cdr.detectChanges();
      }
    });
  }

  onFacultadBusquedaChange(): void {
    this.escuelaBusqueda = '';
    const facSeleccionada = this.facultades.find(f => f.nombre === this.facultadBusqueda);
    if (facSeleccionada) {
      this.escuelasFiltradas = this.escuelas.filter(e => e.facultadId === facSeleccionada.id);
    } else {
      this.escuelasFiltradas = [];
    }
    this.paginaActual = 0;
    this.cargarLaboratorios();
  }

  onEscuelaBusquedaChange(): void {
    this.paginaActual = 0;
    this.cargarLaboratorios();
  }

  limpiarBusqueda(): void {
    this.facultadBusqueda = '';
    this.escuelaBusqueda = '';
    this.escuelasFiltradas = [];
    this.paginaActual = 0;
    this.cargarLaboratorios();
  }

  onFacultadFormChange(tipo: 'crear' | 'editar'): void {
    const model = tipo === 'crear' ? this.nuevoLaboratorio : this.laboratorioEdicion;
    if (!model) return;

    model.escuela = '';
    const facSeleccionada = this.facultades.find(f => f.nombre === model.facultad);
    if (facSeleccionada) {
      this.escuelasFormulario = this.escuelas.filter(e => e.facultadId === facSeleccionada.id);
    } else {
      this.escuelasFormulario = [];
    }
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.cargarLaboratorios();
    }
  }

  abrirCrear(): void {
    this.mostrarFormularioNueva = true;
    this.laboratorioEdicion = null;
    this.nuevoLaboratorio = {
      facultad: '',
      escuela: '',
      poseeSistemaGestion: false
    };
    this.escuelasFormulario = [];
  }

  cancelarCrear(): void {
    this.mostrarFormularioNueva = false;
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.nuevoLaboratorio.facultad || !this.nuevoLaboratorio.escuela) {
      this.error = 'Debe seleccionar Facultad y Escuela';
      return;
    }

    this.laboratorioService.crear(this.nuevoLaboratorio).subscribe({
      next: () => {
        this.mensaje = 'Laboratorio registrado con éxito';
        this.mostrarFormularioNueva = false;
        this.cargarLaboratorios();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrar laboratorio';
        this.cdr.detectChanges();
      }
    });
  }

  editar(lab: Laboratorio): void {
    this.laboratorioEdicion = { ...lab };
    this.mostrarFormularioNueva = false;

    const facSeleccionada = this.facultades.find(f => f.nombre === lab.facultad);
    if (facSeleccionada) {
      this.escuelasFormulario = this.escuelas.filter(e => e.facultadId === facSeleccionada.id);
    } else {
      this.escuelasFormulario = [];
    }
  }

  cancelarEdicion(): void {
    this.laboratorioEdicion = null;
  }

  actualizar(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.laboratorioEdicion || !this.laboratorioEdicion.id) return;

    this.laboratorioService.actualizar(this.laboratorioEdicion.id, this.laboratorioEdicion).subscribe({
      next: () => {
        this.mensaje = 'Laboratorio actualizado con éxito';
        this.laboratorioEdicion = null;
        this.cargarLaboratorios();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al actualizar laboratorio';
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Está seguro de eliminar este laboratorio?')) return;
    this.mensaje = '';
    this.error = '';

    this.laboratorioService.eliminar(id).subscribe({
      next: () => {
        this.mensaje = 'Laboratorio eliminado con éxito';
        this.cargarLaboratorios();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al eliminar laboratorio';
        this.cdr.detectChanges();
      }
    });
  }
}
