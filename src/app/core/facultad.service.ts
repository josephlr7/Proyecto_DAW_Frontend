import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Facultad } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacultadService {

  private readonly http = inject(HttpClient);
  private readonly url = '/api/facultades';

  listar(): Observable<Facultad[]> {
    return this.http.get<Facultad[]>(
      this.url
    );
  }

  crear(
    facultad: Facultad
  ): Observable<Facultad> {
    return this.http.post<Facultad>(
      this.url,
      facultad
    );
  }

  actualizar(
    id: number,
    facultad: Facultad
  ): Observable<Facultad> {
    return this.http.put<Facultad>(
      `${this.url}/${id}`,
      facultad
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.url}/${id}`
    );
  }
}
