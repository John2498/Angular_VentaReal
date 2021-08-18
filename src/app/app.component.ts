import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from './models/usuario';
import { ApiauthService } from './services/apiauth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Venta Real';
  usuario: Usuario;

  constructor(public apiAuthService: ApiauthService,
              private router: Router)
  { 
    this.apiAuthService.usuario.subscribe(res => {
      this.usuario = res;
    }); 
  }

  logout(){
    this.apiAuthService.logout();
    this.router.navigate(['/login']);
  }
}
