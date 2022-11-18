import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

declare const google: any;

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) {
    this.googleInit();
   }

  veryToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${base_url}/login/renew`, {
      headers : {
        'x-token': token
      }
    } ).pipe(
      tap((resp: any)=>{
        localStorage.setItem('token', resp.token)
      }),
      map((resp:any) => true),
      catchError(error=> of(false))
    );
  }

  crearUsuario( formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData )
    .pipe(
      tap((resp: any)=>{
        localStorage.setItem('token', resp.token)
      })
    )
  }

  login( formData: any) {
    return this.http.post(`${base_url}/login`, formData )
        .pipe(
          tap((resp: any)=>{
            localStorage.setItem('token', resp.token)
          })
        )

  }

  loginGoogle( token: string) {
    return this.http.post(`${base_url}/login/google`, {token} )
        .pipe(
          tap((resp: any)=>{
            localStorage.setItem('token', resp.token)
          })
        )


  }

  googleInit() {

    return new Promise( (resolve) => {
      google.load('auth2', () => {
        this.auth2 = google.auth2.init({
          client_id: '1076846195512-6kkpj26a0hqb3o4nc0omd84vijnvvaec.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve;
      });

    })

  }

  logout(){
    localStorage.removeItem('token');


    this.auth2.signOut().then(()=>{
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      })


    })
  }


}
