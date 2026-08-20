import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Escuela } from './models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EscuelaService {

  private readonly http = inject(HttpClient);
  private readonly url = '/api/escuelas';

  listar(): Observable<Escuela[]> {
    return this.http.get<Escuela[]>(
      this.url
    );
  }

  crear(
    escuela: Escuela
  ): Observable<Escuela> {
    return this.http.post<Escuela>(
      this.url,
      escuela
    );
  }

  actualizar(
    id: number,
    escuela: Escuela
  ): Observable<Escuela> {
    return this.http.put<Escuela>(
      `${this.url}/${id}`,
      escuela
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.url}/${id}`
    );
  }
}
