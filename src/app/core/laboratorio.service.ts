import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Laboratorio } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LaboratorioService {

  private readonly http = inject(HttpClient);
  private readonly url = '/api/laboratorios';

  consultar(
    facultad: string | null,
    escuela: string | null,
    page: number,
    size: number
  ): Observable<any> {
    let queryParams = `?page=${page}&size=${size}`;
    if (facultad) queryParams += `&facultad=${encodeURIComponent(facultad)}`;
    if (escuela) queryParams += `&escuela=${encodeURIComponent(escuela)}`;
    
    return this.http.get<any>(
      `${this.url}/consulta${queryParams}`
    );
  }

  crear(
    laboratorio: Laboratorio
  ): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(
      this.url,
      laboratorio
    );
  }

  actualizar(
    id: number,
    laboratorio: Laboratorio
  ): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(
      `${this.url}/${id}`,
      laboratorio
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.url}/${id}`
    );
  }
}
