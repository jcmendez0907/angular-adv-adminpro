import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginForm } from '../../interfaces/login-form.interface';

declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn')
  googleBtn!: ElementRef;

  public formSubmitted = false;

  public auth2: any;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password : ['', [Validators.required]],
    remember: [true],
  });

  constructor( private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService, private ngZone: NgZone) { }
  ngAfterViewInit(): void {
    this.googleInit();
  }

  async googleInit(){
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin( this.googleBtn.nativeElement );
    /*
    google.accounts.id.initialize({
      client_id: 'google_cliente_id',
      callback: (response:any) => this.handleCredentialResponse(response)
    });
    */
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );

  }

  attachSignin(element:any) {

    this.auth2.attachClickHandler( element, {},
        (googleUser: any) => {
            const id_token = googleUser.getAuthResponse().id_token;
            // console.log(id_token);
            this.usuarioService.loginGoogle( id_token )
              .subscribe( resp => {
                // Navegar al Dashboard
                this.ngZone.run( () => {
                  this.router.navigateByUrl('/');
                })
              });

        }, (error :any ) => {
            alert(JSON.stringify(error, undefined, 2));
        });
  }


  login(){

    if(this.loginForm.invalid){
      return
    }else{

      this.usuarioService.login(this.loginForm.value)
        .subscribe((resp) =>{
          this.router.navigateByUrl('/dashboard')

      }, (error)=>{
        Swal.fire('Error', error.error.msg);
      })
    }
    //this.router.navigateByUrl('/dashboard')

  }

  logout(){

  }
}
