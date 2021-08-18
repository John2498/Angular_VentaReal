import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../models/response';
import { Venta } from '../models/ventsa';

const httpOptions = {
  headers: new HttpHeaders({
    'Contend-Type' : 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ApiventaService {

  // url: string = "https://localhost:44341/api/venta"
  url: string = "https://wsventa20210817231843.azurewebsites.net/api/venta"

  constructor(
    private _http: HttpClient
  ) { }

  add(venta: Venta): Observable<Response> {
    return this._http.post<Response>(this.url, venta, httpOptions);
  }

  getVentas(): Observable<Response> {
    return this._http.get<Response>(this.url);
  }
}
