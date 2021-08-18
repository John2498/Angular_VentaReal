import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogVentaComponent } from './dialog/dialogventa.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { ApiventaService } from '../services/apiventa.service';
import { ApiclienteService } from '../services/apicliente.service';
import { VentaRes } from '../models/venta-res';
import { Venta } from '../models/ventsa';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class VentaComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['id', 'cliente', 'fecha', 'subTotal', 'total', 'estado'];
  public dataSource = new MatTableDataSource<VentaRes>();
  public ventasConcepto: VentaRes[] = [];


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  readonly width: string = '600px';

  constructor(
    public matDialog: MatDialog,
    public snackBar: MatSnackBar,
    public apiVentas: ApiventaService,
    public apiClientes: ApiclienteService
  ) { }

  ngOnInit(): void {
    this.getVentas();
  }

  getVentas(){
    this.apiVentas.getVentas().subscribe(res => {
      // this.dataSource.data = res.data
      // console.log(this.dataSource.data)

      this.dataSource.data = res.data
      // console.log(this.dataSource.data.forEach(element => {
      //   element.conceptos.forEach(elmnt => {
      //     console.log(elmnt)
      //   })
      // }))

    })
  }

  openAdd(){
    const dialogRef = this.matDialog.open(DialogVentaComponent, {
      width: this.width
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getVentas();
    });
  }
}