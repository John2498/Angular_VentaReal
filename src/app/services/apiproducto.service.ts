import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

import { Response } from '../models/response';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type' : 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ApiproductoService {

  // url: string = 'https://localhost:44341/api/producto';
  url: string = 'https://wsventa20210817231843.azurewebsites.net/api/producto';

  constructor(
    private _http: HttpClient
  ) { }

  getProductos(): Observable<Response> {
    return this._http.get<Response>(this.url);
  }

  add(producto: Producto): Observable<Response> {
    return this._http.post<Response>(this.url, producto, httpOptions);
  }

  edit(producto: Producto): Observable<Response> {
    return this._http.put<Response>(this.url, producto, httpOptions);
  }

  delete(id: string): Observable<Response> {
    return this._http.delete<Response>(`${this.url}/${id}`);
  }

  getProductoById(id: string): Observable<Response> {
    return this._http.get<Response>(`${this.url}/${id}`);
  }
}
