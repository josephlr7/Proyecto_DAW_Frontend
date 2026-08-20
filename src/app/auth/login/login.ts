import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  username = '';
  password = '';
  mensaje = '';
  cargando = false;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ingresar(): void {
    this.cargando = true;
    this.mensaje = '';

    this.authService
      .login(this.username, this.password)
      .subscribe({
        next: () => {
          this.cargando = false;

          if (
            this.authService.tieneRol('ROLE_ADMIN') ||
            this.authService.tieneRol('ROLE_PERSONAL')
          ) {
            void this.router.navigate(['/dashboard']);
            return;
          }

          if (this.authService.tieneRol('ROLE_INVESTIGADOR')) {
            void this.router.navigate(['/uso-equipos']);
            return;
          }

          this.mensaje = 'El usuario no tiene acceso a la aplicación';
        },
        error: () => {
          this.cargando = false;
          this.mensaje = 'Usuario o contraseña incorrectos';
        }
      });
  }
}
