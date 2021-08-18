import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { Producto } from 'src/app/models/producto';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiproductoService } from 'src/app/services/apiproducto.service';

@Component({
  selector: 'app-dialogproducto',
  templateUrl: './dialogproducto.component.html',
  styleUrls: ['./dialogproducto.component.css']
})
export class DialogproductoComponent implements OnInit {

  public productoForm = this.formBuilder.group({
    id: [''],
    nombre: ['', [Validators.required, Validators.minLength(5)]],
    precioUnitario: ['', Validators.required],
    cantidad: ['', Validators.required],
    costo: ['', Validators.required],
    importe: ['', Validators.required],
  })

  getErrorMessage(field: string): string{
    let message;
    if(this.productoForm.get(field).errors.required){
        message = 'Debe ingresar un valor'
    }else if(this.productoForm.get(field).hasError('pattern')){
        message = 'No es un email valido'
    }else if(this.productoForm.get(field).hasError('minlength')){
        const minLength = this.productoForm.get(field).errors?.minlength
        .requiredLength;
        message = `Este campo debe tener almenos ${minLength} caracteres`;
    }

    return message;
}

isValidField(field: string): boolean{
    return (
        (this.productoForm.get(field).touched || this.productoForm.get(field).dirty) && 
        !this.productoForm.get(field).valid
    );
}

  constructor(
    public dialogRef: MatDialogRef<DialogproductoComponent>,
        public apiProducto: ApiproductoService,
        public snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public producto: Producto
  ) {
    if(this.producto != null){
        this.productoForm.setValue({'id': this.producto.id,
                                    'nombre' : this.producto.nombre,
                                    'precioUnitario' : this.producto.precioUnitario,
                                    'cantidad' : this.producto.cantidad,
                                    'costo': this.producto.costo,
                                    'importe': this.producto.importe})
    }
   }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close();
  }

  addProducto(){
    this.apiProducto.add(this.productoForm.value).subscribe(res => {
      if(res.exito == 1){
        this.dialogRef.close();
        this.snackBar.open('Producto insertado con éxito', '', {
          duration: 2000
        });
      }
    });
  }

  editProducto(){
    this.apiProducto.edit(this.productoForm.value).subscribe(res => {
      if(res.exito == 1){
        this.dialogRef.close();
        this.snackBar.open('Producto editado con éxito', '', {
          duration: 2000
        })
      }
    })

  }
}
