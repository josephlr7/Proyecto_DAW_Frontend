import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PerfilPersonal {
  fechaContratacion?: string;
  biografia?: string;
  nroOficina?: string;
}

export interface PersonalRequest {
  nombres: string;
  apellidos: string;
  dni: string;
  genero: string;
  resolucionNumero?: string;
  cargo: string;
  fotoUrl?: string;
  esDocente: boolean;
  renacyt: boolean;
  esDocenteInvestigadorUNT: boolean;
  condicion: string;
  categoria: string;
  laboratorioId: number;
  perfil?: PerfilPersonal;
}

export interface PersonalResponse {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  genero: string;
  resolucionNumero: string;
  cargo: string;
  fotoUrl: string;
  esDocente: boolean;
  renacyt: boolean;
  esDocenteInvestigadorUNT: boolean;
  condicion: string;
  categoria: string;
  laboratorioId: number;
  biografia?: string;
  fechaContratacion?: string;
  nroOficina?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PersonalService {

  private readonly http = inject(HttpClient);
  private readonly url = '/api/personal';

  listar(): Observable<PersonalResponse[]> {
    return this.http.get<PersonalResponse[]>(this.url);
  }

  consultar(
    cargo: string | null,
    nombres: string | null,
    page: number,
    size: number
  ): Observable<any> {
    let queryParams = `?page=${page}&size=${size}`;
    if (cargo) queryParams += `&cargo=${encodeURIComponent(cargo)}`;
    if (nombres) queryParams += `&nombres=${encodeURIComponent(nombres)}`;
    
    return this.http.get<any>(`${this.url}/consulta${queryParams}`);
  }

  crear(request: PersonalRequest): Observable<PersonalResponse> {
    return this.http.post<PersonalResponse>(this.url, request);
  }

  actualizar(id: number, request: PersonalRequest): Observable<PersonalResponse> {
    return this.http.put<PersonalResponse>(`${this.url}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
