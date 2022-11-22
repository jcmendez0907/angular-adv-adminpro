import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {


  public ocultarModal: boolean = false;

  public imagenSubir: File = {} as File;
  public imgTemp: any = null;

  constructor( public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo, id|| '')
      .then(resp=>{

        Swal.fire('Guardado', 'Imagen actualizada', 'success');
        this.modalImagenService.nuevaImagen.emit(resp);
        this.cerrarModal();
      },(error)=>{
        Swal.fire('Error', error.error.msg, 'error');
      })
  }


}
