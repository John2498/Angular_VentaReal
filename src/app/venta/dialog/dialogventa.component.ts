import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Cliente } from "src/app/models/cliente";
import { Concepto } from "src/app/models/concepto";
import { Producto } from "src/app/models/producto";
import { Venta } from "src/app/models/ventsa";
import { ApiclienteService } from "src/app/services/apicliente.service";
import { ApiproductoService } from "src/app/services/apiproducto.service";
import { ApiventaService } from "src/app/services/apiventa.service";

@Component({
    templateUrl: 'dialogventa.component.html'
})
export class DialogVentaComponent{
    
    public venta: Venta;
    public concepts: Concepto[];
    public clientes: Cliente[];
    public productos: Producto[];
    public itemProducto: Producto;

    public nCantidad = 1;

    public conceptForm = this.formBuilder.group({
        cantidad: [0, [Validators.required, Validators.min(1)]],
        importe: [null],
        idProducto: [null],
        precioUnitario: [null]
    })

    getErrorMessage(field: string): string{
        let message;
        if(this.conceptForm.get(field).errors.required){
            message = 'Debe ingresar un valor'
        }else if(this.conceptForm.get(field).hasError('min')){
            message = 'Almenos 1 cantidad';
        }
    
        return message;
    }
    
    isValidField(field: string): boolean{
        return (
            (this.conceptForm.get(field).touched || this.conceptForm.get(field).dirty) && 
            !this.conceptForm.get(field).valid
        );
    }

    constructor(
        public dialogRef: MatDialogRef<DialogVentaComponent>,
        public snackBar: MatSnackBar,
        public formBuilder: FormBuilder,
        public apiVenta: ApiventaService,
        public apiCliente: ApiclienteService,
        private apiProducto: ApiproductoService
    ){
        this.concepts = [];
        this.venta = {idCliente: null, idUsuario: 1, estado: 'enviado', conceptos: []};
        this.getClientes();
        this.getProductos();
    }

    close(){
        this.dialogRef.close();
    }

    addConcepto(){

        this.apiProducto.getProductoById(this.conceptForm.get('idProducto').value).subscribe(res => {
            this.itemProducto = res.data;
            if(this.itemProducto != undefined){
                this.conceptForm.setValue({ 'idProducto': this.conceptForm.get('idProducto').value,
                                            'cantidad': this.conceptForm.get('cantidad').value,
                                            'precioUnitario': this.itemProducto.precioUnitario, 
                                            'importe': this.itemProducto.importe})
            this.concepts.push(this.conceptForm.value);
            var producto;
            var encontrado
            
            encontrado = this.productos.find(elemento => elemento.id == this.conceptForm.get('idProducto').value)
            producto = this.productos.indexOf(encontrado)

            this.productos.splice(producto, 1)
            }
        })        
    }

    addVenta(){
        this.venta.conceptos = this.concepts;
        
        this.reducirCantidadProductoDB();

        this.apiVenta.add(this.venta).subscribe(response => {
            if(response.exito === 1){
                this.dialogRef.close();
                this.snackBar.open('Venta insertada con éxito', '',
                {
                    duration: 2000
                });
            }
        })
    }

    reducirCantidadProductoDB(){
        let producto;
        this.concepts;
        
        this.concepts.forEach(element => {
            this.apiProducto.getProductoById(element.idProducto.toString()).subscribe(res => {
                producto = res.data;
                producto.cantidad = producto.cantidad - element.cantidad;

                this.apiProducto.edit(producto).subscribe(res => {
                    if(res.exito == 1){
                        // console.log('Cantidad reducida')
                    }
                })
            })
        });
    }

    getClientes() {
        this.apiCliente.getCliente().subscribe(response => {
          this.clientes = response.data;
        });
      }

    getProductos(){

      this.apiProducto.getProductos().subscribe(res => {
        let productoEncontrado;
        let indexProducto;

        this.productos = res.data
        productoEncontrado = this.productos.find(element => element.cantidad < 0);
        indexProducto = this.productos.indexOf(productoEncontrado)
        this.productos.splice(indexProducto, 1)
        
      })
    }

    addCantidadProducto(item: Concepto){
        let max = 0;

        this.apiProducto.getProductoById(item.idProducto.toString()).subscribe(res => {
            this.itemProducto = res.data;
            if(this.itemProducto != undefined){
                max = this.itemProducto.cantidad
                if(item.cantidad < max){
                    item.cantidad = item.cantidad + 1;
                }else {
                    this.snackBar.open('No puede seleccionar mas', 'ERROR',{
                        duration: 2000
                    });
                }
            }
        })
    }

    resCantidadProducto(item: Concepto){
        let max = 0;

        this.apiProducto.getProductoById(item.idProducto.toString()).subscribe(res => {
            this.itemProducto = res.data;
            if(this.itemProducto != undefined){
                max = this.itemProducto.cantidad
                if(item.cantidad > 1){
                    item.cantidad = item.cantidad - 1;
                }else {
                    this.snackBar.open('Debe existir almenos una cantidad', 'INFORMACIÓN',{
                        duration: 2000
                    });
                }
            }
        })
    }

    delProductoConcepto(item: Concepto){
        let indexProducto;
        let productoEncontrado;
        productoEncontrado = this.concepts.find(element => element.idProducto == item.idProducto);
        indexProducto =  this.concepts.indexOf(productoEncontrado)
        this.concepts.splice(indexProducto, 1)

        this.apiProducto.getProductoById(item.idProducto.toString()).subscribe(res => {
            this.itemProducto = res.data;
            this.productos.push(this.itemProducto)
        })
    }

    onChange(idProducto){
        this.apiProducto.getProductoById(idProducto).subscribe(res => {
            this.itemProducto = res.data;
            if(this.itemProducto != undefined){
                this.nCantidad = this.itemProducto.cantidad
                this.conceptForm.get('cantidad').setValidators(Validators.max(this.nCantidad))
            }
        })
    }
}