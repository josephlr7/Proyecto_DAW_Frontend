import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Consumible {
  id?: number;
  nombre: string;
  marca: string;
  empresa: string;
  estadoAdquirido: string;
  tipo: string;
  unidadMedida: string;
  funcion?: string;
  rangoPrecio: string;
  fechaAdquisicion?: string;
  fechaVencimiento?: string;
  cantidad: number;
  stockMinimo: number;
  laboratorioId: number;
}

@Injectable({
  providedIn: 'root',
})
export class ConsumibleService {

  private readonly http = inject(HttpClient);
  private readonly url = '/api/consumibles';

  listar(): Observable<Consumible[]> {
    return this.http.get<Consumible[]>(this.url);
  }

  listarPorLaboratorio(laboratorioId: number): Observable<Consumible[]> {
    return this.http.get<Consumible[]>(`${this.url}/laboratorio/${laboratorioId}`);
  }

  crear(consumible: Consumible): Observable<Consumible> {
    return this.http.post<Consumible>(this.url, consumible);
  }

  actualizar(id: number, consumible: Consumible): Observable<Consumible> {
    return this.http.put<Consumible>(`${this.url}/${id}`, consumible);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
