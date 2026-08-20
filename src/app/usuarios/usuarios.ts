import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
})
export class Usuarios {

  private readonly authService = inject(AuthService);

  username = '';
  password = '';
  nombre = '';

  mensaje = '';
  error = '';
  cargando = false;

  registrarUsuario(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.username.trim() || !this.password.trim() || !this.nombre.trim()) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    this.cargando = true;

    this.authService.registrar(this.username, this.password, this.nombre).subscribe({
      next: () => {
        this.cargando = false;
        this.mensaje = `Usuario '${this.username}' registrado con éxito con rol predeterminado de PERSONAL.`;
        this.username = '';
        this.password = '';
        this.nombre = '';
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.message || 'Error al registrar el usuario';
      }
    });
  }
}
