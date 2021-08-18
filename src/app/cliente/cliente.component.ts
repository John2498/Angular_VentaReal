import { Component, OnInit } from '@angular/core';
import { ApiclienteService } from '../services/apicliente.service';

import { DialogClienteComponent } from './dialog/dialogcliente.component';

import { MatDialog } from '@angular/material/dialog';

import { Response } from '../models/response';
import { Cliente } from '../models/cliente';
import { DialogDeleteComponent } from '../common/delete/dialogdelete.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  public lst: any[] = [];
  public columnas: string[] = ['id', 'cedula', 'nombre', 'edad', 'telefono', 'email', 'direccion', 'actions'];
  readonly width: string = '300px';

  constructor(
    private apiCliente: ApiclienteService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes() {
    this.apiCliente.getCliente().subscribe(response => {
      this.lst = response.data;
      console.log(this.lst)
    });
  }

  openAdd(){
    const dialogRef = this.dialog.open(DialogClienteComponent, {
      width: this.width
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getClientes();
    });
  }

  openEdit(cliente: Cliente){
    const dialogRef = this.dialog.open(DialogClienteComponent, {
      width: this.width,
      data: cliente
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getClientes();
    });
  }

  delete(cliente: Cliente){
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: this.width
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.apiCliente.delete(cliente.id.toString()).subscribe(response => {
          if(response.exito == 1){
            this.snackBar.open('Cliente eliminado con éxito', '', {
              duration: 2000
            })
            this.getClientes();
          }
        })
      }
    });
  }
}
