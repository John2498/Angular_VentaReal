import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiauthService } from "../services/apiauth.service";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";

@Component({ templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit{

    private _isValidEmail = /\S+@\S+\.\S+/;

    public loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.pattern(this._isValidEmail)]],
        password: ['', [Validators.required]]
    })

    /*public loginForm = new FormGroup({
        email : new FormControl(''),
        password : new FormControl('')
    });*/

    constructor(public apiAuthService: ApiauthService,
                private router: Router,
                private formBuilder: FormBuilder)
    {
        // if(this.apiAuthService.usuarioData){
        //     this.router.navigate(['/']);
        // }
    }

    ngOnInit(){}

    login(){
        this.apiAuthService.login(this.loginForm.value).subscribe( response => {
            if(response.exito === 1){
                this.router.navigate(['/'])
            }
        })
    }

    getErrorMessage(field: string): string{
        let message;
        if(this.loginForm.get(field).errors.required){
            message = 'Debe ingresar un valor'
        }else if(this.loginForm.get(field).hasError('pattern')){
            message = 'No es un email valido'
        }else if(this.loginForm.get(field).hasError('minlength')){
            const minLength = this.loginForm.get(field).errors?.minlength
            .requiredLength;
            message = `Este campo debe tener almenos ${minLength} caracteres`;
        }

        return message;
    }

    isValidField(field: string): boolean{
        return (
            (this.loginForm.get(field).touched || this.loginForm.get(field).dirty) && 
            !this.loginForm.get(field).valid
        );
    }
}