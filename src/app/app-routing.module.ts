import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component'; 
import { ClienteComponent } from './cliente/cliente.component';
import { AuthGuard } from './security/auth.guard';
import { LoginComponent } from './login/login.component';
import { VentaComponent } from './venta/venta.component';
import { ProductoComponent } from './producto/producto/producto.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'cliente', component: ClienteComponent, canActivate: [AuthGuard]},
  {path: 'producto', component: ProductoComponent, canActivate: [AuthGuard]},
  {path: 'venta', component: VentaComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
