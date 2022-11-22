import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;
  public tipo: string = '';
  public id:string = '';
  public img?:string = 'no-img';

  public  nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal( tipo: string, id:string, img?:string){
    this._ocultarModal = false;

    this.tipo = tipo;
    this.id = id;

    if (img?.includes('https')){
      this.img = img;
    }else {
      this.img = `${base_url}/uploads/${tipo}/${img}`;
    }
    console.log(this.img);

    // return this._ocultarModal = false;
  }

  cerrarModal(){
    return this._ocultarModal = true;
  }

  constructor() {
    this.tipo = '';
   }
}
