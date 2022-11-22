import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalRegistros: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;

  public imgSubs: Subscription = new Subscription;

  constructor(private usuariosService:UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    ).subscribe(img=>{
      this.cargarUsuarios();
    })
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuariosService.cargarUsuarios(this.desde).subscribe(({total, usuarios})=>{
      this.totalRegistros = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;

    })
  }
  cambiarPagina(from: number ){
    this.desde += from;
    if( this.desde <0){
      this.desde = 0;
    } else if( this.desde >=  this.totalRegistros){
      this.desde -= from;
    }
    this.cargarUsuarios();
  }

  buscar(termin:string){
    if(termin.length === 0 ){
      this.usuarios = this.usuariosTemp;
    }
    this.busquedasService.buscar('usuarios', termin).subscribe((resp)=>{
      this.usuarios = resp;
    })
  }

  eliminarUsuario(item:Usuario){

    if(item.uid === this.usuariosService.uid){
      Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    } else {
      Swal.fire({
        title: 'Borrar Usuario?',
        text: "Esta a punto de eliminar este usuario",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!!'
      }).then((result) =>{
        if(result.value){
          this.usuariosService.eliminarUsuario(item).subscribe((resp)=>{
            Swal.fire('Eliminado', 'Usuario elimiando', 'success');
            this.cargarUsuarios();
          })

        }
      })
    }



  }

  cambiarRol(item: Usuario){
    this.usuariosService.guardarUsuario(item).subscribe((resp)=>{

    });
  }

  abrirModal(item: Usuario){
    this.modalImagenService.abrirModal('usuarios', item.uid || '', item.img);
  }

}
