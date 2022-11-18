import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

import Swal from 'sweetalert2'
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    password2: ['', [Validators.required]],
    terminos: [false, [Validators.required]],
  }, {
    validators: this.passwordIguales('password', 'password2')
  });
  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) { }

  public crearUsuario(){
    this.formSubmitted = true;
    console.log(this.registerForm.value);
    if(this.registerForm.invalid){
      return
    }else{
      this.usuarioService.crearUsuario(this.registerForm.value).subscribe(resp =>{
        this.router.navigateByUrl('/dashboard')
      }, (error)=>{
        Swal.fire('Error', error.error.msg);
      })
    }

  }

  campoNoValido(campo: string): boolean {
    if(this.registerForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    }else {
      return false;
    }
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  passwordNoValidos(){
    const p1 = this.registerForm.get('password')?.value;
    const p2 = this.registerForm.get('password2')?.value;
    if( (p1 !== p2) && this.formSubmitted){
      return false;
    }else{
      return true;
    }
  }

  passwordIguales(password: string, password2: string){
    return (formGroup: FormGroup) =>{
      const pass1Control = formGroup.get(password);
      const pass2Control = formGroup.get(password2);
      if(pass1Control?.value === pass2Control?.value){
        pass2Control?.setErrors(null);
      }else{
        pass2Control?.setErrors({noEsIgual: true});
      }
    }
  }

}
