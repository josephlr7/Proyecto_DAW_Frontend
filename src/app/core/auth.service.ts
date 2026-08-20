import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from './models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly http = inject(HttpClient);

  registrar(
    username: string,
    password: string,
    nombre: string
  ): Observable<any> {
    return this.http.post<any>(
      '/api/auth/registro',
      { username, password, nombre }
    );
  }

  login(
    username: string,
    password: string
  ): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        '/api/auth/login',
        {
          username,
          password
        }
      )
      .pipe(
        tap(Response => {
          console.log('Respuesta del servidor al iniciar sesión:', Response);
          
          sessionStorage.setItem(
            'authToken',
            Response.token
          );

          sessionStorage.setItem(
            'authUsername',
            Response.username
          );

          sessionStorage.setItem(
            'authNombre',
            Response.nombre || Response.username
          );

          sessionStorage.setItem(
            'authRoles',
            JSON.stringify(Response.roles)
          );
        })
      );
  }

  obtenerToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  obtenerUsername(): string {
    return sessionStorage.getItem(
      'authUsername'
    ) ?? '';
  }

  obtenerNombre(): string {
    return sessionStorage.getItem(
      'authNombre'
    ) ?? this.obtenerUsername();
  }

  obtenerRoles(): string[] {
    const roles =
      sessionStorage.getItem('authRoles');

    return roles
      ? JSON.parse(roles) as string[]
      : [];
  }

  tieneRol(rol: string): boolean {
    return this.obtenerRoles().includes(rol);
  }

  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUsername');
    sessionStorage.removeItem('authNombre');
    sessionStorage.removeItem('authRoles');
  }
}
