import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios-interface';

declare const google: any;

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
    this.usuario = new Usuario('', '');
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get role(): string {
    return this.usuario.role || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  veryToken(): Observable<boolean> {
    // const token = localStorage.getItem('token') || '';
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          localStorage.setItem('token', resp.token);
          const { email, google, nombre, role, uid, img = '' } = resp.usuario;
          this.usuario = new Usuario(nombre, email, '', role, google, img, uid);
          return true;
        }),

        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData, {
      headers: {
        'x-token': this.token,
      },
    });
  }

  actualizarPerfil(data: { email: string; nombre: string; role: string }) {
    data = {
      ...data,
      role: this.usuario.role || '',
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers).pipe(
      tap((resp: any) => {
        this.usuario = resp.usuario;
        //localStorage.setItem('token', resp.token)
      })
    );
  }

  login(formData: any) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  googleInit() {
    return new Promise((resolve) => {
      google.load('auth2', () => {
        this.auth2 = google.auth2.init({
          client_id:
            '1076846195512-6kkpj26a0hqb3o4nc0omd84vijnvvaec.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve;
      });
    });
  }

  logout() {
    localStorage.removeItem('token');

    /*

    this.auth2.signOut().then(()=>{
      this.ngZone.run(()=>{
        this.router.navigateByUrl('/login');
      })


    })
    */
    this.router.navigateByUrl('/login');
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers).pipe(
      map((resp) => {
        const usuarios = resp.usuarios.map(
          user =>
            new Usuario(
              user.nombre,
              user.email,
              user.password,
              user.role,
              user.google,
              user.img,
              user.uid
            )
        );
        return {
          total: resp.total,
          usuarios,
        }
      })
    );
  }

  eliminarUsuario(data: Usuario) {
    const url = `${base_url}/usuarios/${data.uid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(data: Usuario) {
    return this.http.put(`${base_url}/usuarios/${data.uid}`, data, this.headers);
  }

}
