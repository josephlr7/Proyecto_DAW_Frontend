export interface LoginResponse {
  token: string;
  tipo: string;
  expiresIn: number;
  username: string;
  nombre: string;
  roles: string[];
}

export interface Laboratorio {
  id?: number;
  facultad: string;
  escuela: string;
  poseeSistemaGestion: boolean;
}

export interface Facultad {
  id?: number;
  nombre: string;
}

export interface Escuela {
  id?: number;
  nombre: string;
  facultadId: number;
}
