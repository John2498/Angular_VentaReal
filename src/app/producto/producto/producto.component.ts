import { Component, OnInit } from '@angular/core';
import { ApiproductoService } from 'src/app/services/apiproducto.service';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DialogproductoComponent } from '../dialog/dialogproducto/dialogproducto.component';
import { Producto } from 'src/app/models/producto';
import { DialogDeleteComponent } from 'src/app/common/delete/dialogdelete.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  public dataSource: any[] = [];
  public columnas: string[] = ['id','nombre','cantidad','precioUnitario','costo','importe', 'actions'];
  readonly width: string = '300px';

  constructor(
    private apiProducto: ApiproductoService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getProductos();
  }

  getProductos(){
    this.apiProducto.getProductos().subscribe(res => {
      this.dataSource = res.data;
    })
  }

  openAdd(){
    const dialogRef = this.dialog.open(DialogproductoComponent, {
      width: this.width
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getProductos();
    });
  }

  openEdit(producto: Producto){
    const dialogRef = this.dialog.open(DialogproductoComponent, {
      width: this.width,
      data: producto
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getProductos();
    });
  }

  delete(producto: Producto){
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: this.width
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.apiProducto.delete(producto.id.toString()).subscribe(response => {
          if(response.exito == 1){
            this.snackBar.open('Producto eliminado con éxito', '', {
              duration: 2000
            })
            this.getProductos();
          }
        })
      }
    });
  }
}
