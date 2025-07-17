import { Routes } from '@angular/router';
import { VentasListComponent } from './pages/ventas-list/ventas-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VentasFormComponent } from './components/ventas/ventas-form/ventas-form.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DeudoresComponent } from './pages/deudores/deudores.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'ventas', component: VentasListComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'ventas-form', component: VentasFormComponent, canActivate: [authGuard] },
  { path: 'deudores', component: DeudoresComponent, canActivate: [authGuard] },
];