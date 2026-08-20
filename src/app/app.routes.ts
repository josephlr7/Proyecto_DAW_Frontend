import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Laboratorios } from './laboratorios/laboratorios';
import { Facultades } from './facultades/facultades';
import { Escuelas } from './escuelas/escuelas';
import { Equipamientos } from './equipamientos/equipamientos';
import { Consumibles } from './consumibles/consumibles';
import { Personal } from './personal/personal';
import { UsoEquipos } from './uso-equipos/uso-equipos';
import { UsoConsumibles } from './uso-consumibles/uso-consumibles';
import { Usuarios } from './usuarios/usuarios';
import { Dashboard } from './dashboard/dashboard';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/auth.service';

// Guard: solo ADMIN
const soloAdmin = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.tieneRol('ROLE_ADMIN')) return true;
  if (auth.tieneRol('ROLE_PERSONAL')) return router.createUrlTree(['/dashboard']);
  if (auth.tieneRol('ROLE_INVESTIGADOR')) return router.createUrlTree(['/uso-equipos']);
  return router.createUrlTree(['/login']);
};

// Guard: ADMIN o PERSONAL
const adminOPersonal = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.tieneRol('ROLE_ADMIN') || auth.tieneRol('ROLE_PERSONAL')) return true;
  if (auth.tieneRol('ROLE_INVESTIGADOR')) return router.createUrlTree(['/uso-equipos']);
  return router.createUrlTree(['/login']);
};

// Guard: autenticado
const autenticado = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.estaAutenticado()) return true;
  return router.createUrlTree(['/login']);
};

export const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [adminOPersonal]
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'laboratorios',
    component: Laboratorios,
    canActivate: [adminOPersonal]
  },
  {
    path: 'facultades',
    component: Facultades,
    canActivate: [soloAdmin]
  },
  {
    path: 'escuelas',
    component: Escuelas,
    canActivate: [soloAdmin]
  },
  {
    path: 'equipamientos',
    component: Equipamientos,
    canActivate: [adminOPersonal]
  },
  {
    path: 'consumibles',
    component: Consumibles,
    canActivate: [adminOPersonal]
  },
  {
    path: 'personal',
    component: Personal,
    canActivate: [soloAdmin]
  },
  {
    path: 'uso-equipos',
    component: UsoEquipos,
    canActivate: [autenticado]
  },
  {
    path: 'uso-consumibles',
    component: UsoConsumibles,
    canActivate: [autenticado]
  },
  {
    path: 'usuarios',
    component: Usuarios,
    canActivate: [soloAdmin]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
