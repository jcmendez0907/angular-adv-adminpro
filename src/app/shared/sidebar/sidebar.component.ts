import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {

  public usuario: Usuario;
  menuItems: any [] = [];
  constructor( private sidebarService: SidebarService, private usuarioService: UsuarioService) {
    this.menuItems = this.sidebarService.menu;
    // this.imgUrl = usuarioService.usuario.ImagenUrl;
    this.usuario = this.usuarioService.usuario;
   }

  ngOnInit(): void {
  }

}
