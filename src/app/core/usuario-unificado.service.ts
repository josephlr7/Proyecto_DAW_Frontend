import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioUnificadoRequest {
  nombres: string;
  apellidos: string;
  dni: string;
  genero: string;
  rolSistema: string;
  cargo?: string;
  condicion?: string;
  laboratorioId?: number;
  esDocente?: boolean;
  renacyt?: boolean;
  esDocenteInvestigadorUNT?: boolean;
  programaEstudios?: string;
  gradoAcademico?: string;
}

export interface UsuarioUnificadoResponse {
  personaId: number;
  nombres: string;
  apellidos: string;
  dni: string;
  genero: string;
  rolSistema: string;
  activo: boolean;
  cargo?: string;
  condicion?: string;
  laboratorioId?: number;
  esDocente?: boolean;
  renacyt?: boolean;
  esDocenteInvestigadorUNT?: boolean;
  programaEstudios?: string;
  gradoAcademico?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioUnificadoService {
  private apiUrl = '/api/usuarios-unificado';

  constructor(private http: HttpClient) {}

  listar(): Observable<UsuarioUnificadoResponse[]> {
    return this.http.get<UsuarioUnificadoResponse[]>(this.apiUrl);
  }

  registrar(request: UsuarioUnificadoRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, request);
  }

  actualizar(dni: string, request: UsuarioUnificadoRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${dni}`, request);
  }

  eliminar(dni: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dni}`);
  }
}
