import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Equipamiento {
  id?: number;
  nombre: string;
  funcion: string;
  rangoPrecio: string;
  anoAdquisicion: number;
  horasUso: number;
  estado: string;
  programaMantenimiento: string;
  programaMantenimientoHoras: number | null;
  seCumpleMantenimiento?: string;
  requiereConsumible: boolean;
  tipoConsumibleRequerido?: string;
  laboratorioId: number;
}

@Injectable({
  providedIn: 'root',
})
export class EquipamientoService {

  private readonly http = inject(HttpClient);
  private readonly url = '/api/equipamiento';

  listar(): Observable<Equipamiento[]> {
    return this.http.get<Equipamiento[]>(this.url);
  }

  listarPorLaboratorio(laboratorioId: number): Observable<Equipamiento[]> {
    return this.http.get<Equipamiento[]>(`${this.url}/laboratorio/${laboratorioId}`);
  }

  crear(equipamiento: Equipamiento): Observable<Equipamiento> {
    return this.http.post<Equipamiento>(this.url, equipamiento);
  }

  actualizar(id: number, equipamiento: Equipamiento): Observable<Equipamiento> {
    return this.http.put<Equipamiento>(`${this.url}/${id}`, equipamiento);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
