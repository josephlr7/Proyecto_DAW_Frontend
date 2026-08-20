import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LaboratorioService } from '../core/laboratorio.service';
import { UsuarioUnificadoService, UsuarioUnificadoRequest, UsuarioUnificadoResponse } from '../core/usuario-unificado.service';
import { Laboratorio } from '../core/models';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal.html',
})
export class Personal implements OnInit {
  private readonly laboratorioService = inject(LaboratorioService);
  private readonly usuarioUnificadoService = inject(UsuarioUnificadoService);
  private readonly cdr = inject(ChangeDetectorRef);

  usuarios: UsuarioUnificadoResponse[] = [];
  laboratorios: Laboratorio[] = [];

  nuevoUsuario: UsuarioUnificadoRequest = this.crearRequestVacio();
  mostrarFormularioNueva = false;
  editandoDni: string | null = null;
  guardando = false;
  
  mensaje = '';
  error = '';

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarLaboratorios();
  }

  cargarUsuarios(): void {
    this.usuarioUnificadoService.listar().subscribe({
      next: (data) => {
        // Listar solo los activos
        this.usuarios = data.filter(u => u.activo);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar los usuarios';
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

  obtenerNombreLaboratorio(labId: number | undefined): string {
    if (!labId) return 'General / No asigando';
    const lab = this.laboratorios.find(l => l.id === labId);
    return lab ? `${lab.escuela}` : `General`;
  }

  abrirCrear(): void {
    this.editandoDni = null;
    this.mostrarFormularioNueva = true;
    this.guardando = false;
    this.nuevoUsuario = this.crearRequestVacio();
    this.cdr.detectChanges();
  }

  abrirEditar(u: UsuarioUnificadoResponse): void {
    this.editandoDni = u.dni;
    this.mostrarFormularioNueva = true;
    this.guardando = false;
    this.nuevoUsuario = {
      nombres: u.nombres,
      apellidos: u.apellidos,
      dni: u.dni,
      genero: u.genero,
      rolSistema: u.rolSistema,
      cargo: u.cargo || 'ASISTENTE',
      condicion: u.condicion || 'CONTRATADO',
      laboratorioId: u.laboratorioId || 0,
      esDocente: u.esDocente || false,
      renacyt: u.renacyt || false,
      esDocenteInvestigadorUNT: u.esDocenteInvestigadorUNT || false,
      programaEstudios: u.programaEstudios || '',
      gradoAcademico: u.gradoAcademico || ''
    };
    this.cdr.detectChanges();
  }

  cancelarCrear(): void {
    this.mostrarFormularioNueva = false;
    this.editandoDni = null;
    this.guardando = false;
    this.cdr.detectChanges();
  }

  crearRequestVacio(): UsuarioUnificadoRequest {
    return {
      nombres: '',
      apellidos: '',
      dni: '',
      genero: 'MASCULINO',
      rolSistema: 'PERSONAL',
      cargo: 'ASISTENTE',
      condicion: 'CONTRATADO',
      laboratorioId: 0,
      esDocente: false,
      renacyt: false,
      esDocenteInvestigadorUNT: false,
      programaEstudios: '',
      gradoAcademico: 'ESTUDIANTE'
    };
  }

  guardar(): void {
    if (this.guardando) return;
    this.mensaje = '';
    this.error = '';

    if (!this.nuevoUsuario.nombres || !this.nuevoUsuario.apellidos || !this.nuevoUsuario.dni) {
      this.error = 'Complete los campos obligatorios: Nombres, Apellidos y DNI.';
      this.cdr.detectChanges();
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    if (this.editandoDni) {
      this.usuarioUnificadoService.actualizar(this.editandoDni, this.nuevoUsuario).subscribe({
        next: () => {
          this.guardando = false;
          this.mensaje = 'Usuario actualizado con éxito.';
          this.mostrarFormularioNueva = false;
          this.editandoDni = null;
          this.cdr.detectChanges();
          this.cargarUsuarios();
        },
        error: (err) => {
          this.guardando = false;
          this.error = err.error?.message || 'Error al actualizar el usuario';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.usuarioUnificadoService.registrar(this.nuevoUsuario).subscribe({
        next: () => {
          this.guardando = false;
          this.mensaje = 'Usuario registrado con éxito. Su contraseña es su número de DNI.';
          this.mostrarFormularioNueva = false;
          this.cdr.detectChanges();
          this.cargarUsuarios();
        },
        error: (err) => {
          this.guardando = false;
          this.error = err.error?.message || 'Error al guardar el usuario';
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminar(dni: string): void {
    if (!confirm('¿Está seguro de dar de baja a este usuario? Se revocará su acceso, pero se mantendrá en el historial de usos.')) return;
    this.mensaje = '';
    this.error = '';

    this.usuarioUnificadoService.eliminar(dni).subscribe({
      next: () => {
        this.mensaje = 'Usuario dado de baja con éxito';
        this.cdr.detectChanges();
        this.cargarUsuarios();
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al dar de baja el usuario';
        this.cdr.detectChanges();
      }
    });
  }
}
