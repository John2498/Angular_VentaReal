import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, pipe } from "rxjs";
import { Response } from '../models/response'
import { Usuario } from "../models/usuario";
import { map } from 'rxjs/operators';
import { Login } from "../models/login";

const httpOptions = {
    headers: new HttpHeaders({
      'Contend-Type' : 'application/json'
    })
  }

@Injectable({
    providedIn: 'root'
})
export class ApiauthService {
    // url: string = 'https://localhost:44341/api/user/login';
    // url: string = 'https://wsventa20210818173835.azurewebsites.net/api/User/login';
    url: string ='https://wsventa20210817231843.azurewebsites.net/api/user/login';

    private usuarioSubject: BehaviorSubject<Usuario>;
    public usuario: Observable<Usuario>;

    public get usuarioData(): Usuario{
      return this.usuarioSubject.value;
    }

    constructor(private _http: HttpClient){
      var dato = localStorage.getItem('usuario');
      this.usuarioSubject = 
        new BehaviorSubject<Usuario>(JSON.parse(localStorage.getItem('usuario') || '{}'));
      this.usuario = this.usuarioSubject.asObservable();
    }

    login(login: Login): Observable<Response>{
        return this._http.post<Response>(this.url, login, httpOptions).pipe(
          map(res => {
            if(res.exito === 1){
              const usuario: Usuario = res.data;
              localStorage.setItem('usuario', JSON.stringify(usuario));
              this.usuarioSubject.next(usuario);
            }
            return res;
          })
        );
    }

    logout(){
      localStorage.removeItem('usuario');
      this.usuarioSubject.next(null);
    }
}