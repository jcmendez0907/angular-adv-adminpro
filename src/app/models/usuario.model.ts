import { environment } from '../../environments/environment.prod';
const api_url = environment.base_url;
export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public role ?: string,
    public google?: string,
    public img ?: string,
    public uid?: string
  ){}

  get ImagenUrl(){
    if(this.img?.includes('https')){
      return this.img;
    }
    if (this.img){
      return `${api_url}/uploads/usuarios/${this.img}`;
    }
    return ''
  }
}
