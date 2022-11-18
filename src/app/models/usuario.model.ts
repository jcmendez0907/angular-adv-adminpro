export class Usuario {
  constructor(
    nombre: string,
    email: string,
    password?: string,
    role ?: string,
    google?: string,
    img ?: string,
    public uid?: string
  ){}
}
