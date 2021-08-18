import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

import { Response } from '../models/response';

const httpOptions = {
  headers: new HttpHeaders({
    'Contend-Type' : 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ApiclienteService {

  // url: string = 'https://localhost:44341/api/cliente';
  url: string = 'https://wsventa20210817231843.azurewebsites.net/api/cliente'

  constructor(
    private _http: HttpClient
  ) { }

  getCliente(): Observable<Response> {
      return this._http.get<Response>(this.url);
  }

  add(cliente: Cliente): Observable<Response> {
    return this._http.post<Response>(this.url, cliente, httpOptions);
  }

  edit(cliente: Cliente): Observable<Response> {
    return this._http.put<Response>(this.url, cliente, httpOptions);
  }

  delete(id: string): Observable<Response> {
    return this._http.delete<Response>(`${this.url}/${id}`);
  }
}
