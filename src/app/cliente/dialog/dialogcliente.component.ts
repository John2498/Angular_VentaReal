import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Cliente } from "src/app/models/cliente";
import { ApiclienteService } from "src/app/services/apicliente.service";

@Component({
    templateUrl: 'dialogcliente.component.html'
})

export class DialogClienteComponent {

    private _isValidEmail = /\S+@\S+\.\S+/;

    public clienteForm = this.formBuilder.group({
        id: [''],
        nombre: ['', [Validators.required, Validators.minLength(5)]],
        cedula: ['',[Validators.required, Validators.minLength(10)]],
        edad: ['',[Validators.required, Validators.min(18)]],
        telefono: ['', [Validators.required, Validators.minLength(10)]],
        direccion: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(this._isValidEmail)]]
    })

    getErrorMessage(field: string): string{
        let message;
        if(this.clienteForm.get(field).errors.required){
            message = 'Debe ingresar un valor'
        }else if(this.clienteForm.get(field).hasError('pattern')){
            message = 'No es un email valido'
        }else if(this.clienteForm.get(field).hasError('minlength')){
            const minLength = this.clienteForm.get(field).errors?.minlength
            .requiredLength;
            message = `Este campo debe tener almenos ${minLength} caracteres`;
        }else if(this.clienteForm.get(field).hasError('min')){
            message = 'El cliente debe ser mayor de edad';
        }
    
        return message;
    }
    
    isValidField(field: string): boolean{
        return (
            (this.clienteForm.get(field).touched || this.clienteForm.get(field).dirty) && 
            !this.clienteForm.get(field).valid
        );
    }

    constructor(
        public dialogRef: MatDialogRef<DialogClienteComponent>,
        public apiCliente: ApiclienteService,
        public snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public cliente: Cliente
    ){
        if(this.cliente != null){
           this.clienteForm.setValue({
               'id': this.cliente.id,
               'nombre': this.cliente.nombre,
               'cedula': this.cliente.cedula,
               'edad': this.cliente.edad,
               'telefono': this.cliente.telefono,
               'direccion': this.cliente.direccion,
               'email': this.cliente.email
           })
        }
    }

    close(){
        this.dialogRef.close();
    }

    addCliente(){
        this.apiCliente.add(this.clienteForm.value).subscribe(response => {
            if(response.exito == 1){
                this.dialogRef.close();
                this.snackBar.open('Cliente insertado con éxito','',{
                    duration: 2000
                });
            }
        });
    }

    editCliente(){
        this.apiCliente.edit(this.clienteForm.value).subscribe(response => {
            if(response.exito == 1){
                this.dialogRef.close();
                this.snackBar.open('Cliente editado con éxito','',{
                    duration: 2000
                });
            }
        });
    }
}