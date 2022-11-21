import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {


  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File = {} as File;
  public imgTemp: any = null;

  constructor( private fb: FormBuilder, private usuariosService: UsuarioService,
    private fileUploadService: FileUploadService) {
    this.perfilForm = fb.group({});
    this.usuario = this.usuariosService.usuario;
    // this.imagenSubir = new File();
   }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required]],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil(){
    this.usuariosService.actualizarPerfil(this.perfilForm.value).subscribe((resp)=>{
      console.log(resp);
      // this.usuario = resp.usuario;
      Swal.fire('Notifacion', 'Usuario actualizado', 'success' )
      this.usuario.nombre = resp.usuario.nombre;
      this.usuario.email = resp.usuario.email;

      Swal.fire('Guardado', 'Cambios fueron guardados', 'success');

    },(error)=>{
      Swal.fire('Error', error.error.msg, 'error');
    })
  }

  cambiarImagen(event: any){
    console.log(event);

    this.imagenSubir = event.target.files[0];

    if(!this.imagenSubir) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.imagenSubir);
     reader.onloadend = ()=>{
      return this.imgTemp = reader.result;
    }

    return;


  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid || '')
      .then(resp=>{
        this.usuario.img = resp
        Swal.fire('Guardado', 'Imagen actualizada', 'success');
      },(error)=>{
        Swal.fire('Error', error.error.msg, 'error');
      })
  }

}
