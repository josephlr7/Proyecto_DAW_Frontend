import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UsoEquipamientoRequestDTO {
  equipamientoId: number | null;
  nombreInvestigador: string;
  tipoInvestigacion: string;
  actividadNombre: string;
  horasUso: number | null;
  fecha: string;
  hora: string;
  observacion: string;
}

export interface UsoConsumibleRequestDTO {
  consumibleId: number | null;
  nombreInvestigador: string;
  tipoInvestigacion: string;
  actividadNombre: string;
  cantidad: number | null;
  fecha: string;
  hora: string;
  observacion: string;
}

export interface UsoEquipamientoResponseDTO {
  id: number;
  equipamientoId: number;
  equipamientoNombre: string;
  investigadorId: number;
  investigadorNombreCompleto: string;
  tipoInvestigacion: string;
  actividadNombre: string;
  nombreInvestigador: string;
  horasUso: number;
  fecha: string;
  hora: string;
  observacion: string;
}

export interface UsoConsumibleResponseDTO {
  id: number;
  consumibleId: number;
  consumibleNombre: string;
  investigadorId: number;
  investigadorNombreCompleto: string;
  tipoInvestigacion: string;
  actividadNombre: string;
  nombreInvestigador: string;
  cantidad: number;
  fecha: string;
  hora: string;
  observacion: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsoService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/usos';

  registrarUsoEquipamiento(request: UsoEquipamientoRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.url}/equipamiento`, request);
  }

  registrarUsoConsumible(request: UsoConsumibleRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.url}/consumible`, request);
  }

  obtenerUsosEquipamiento(): Observable<UsoEquipamientoResponseDTO[]> {
    return this.http.get<UsoEquipamientoResponseDTO[]>(`${this.url}/equipamiento`);
  }

  obtenerUsosConsumible(): Observable<UsoConsumibleResponseDTO[]> {
    return this.http.get<UsoConsumibleResponseDTO[]>(`${this.url}/consumible`);
  }

  eliminarUsoEquipamiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/equipamiento/${id}`);
  }

  eliminarUsoConsumible(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/consumible/${id}`);
  }

  editarUsoEquipamiento(id: number, uso: any): Observable<UsoEquipamientoResponseDTO> {
    return this.http.put<UsoEquipamientoResponseDTO>(`${this.url}/equipamiento/${id}`, uso);
  }

  editarUsoConsumible(id: number, uso: any): Observable<UsoConsumibleResponseDTO> {
    return this.http.put<UsoConsumibleResponseDTO>(`${this.url}/consumible/${id}`, uso);
  }
}
