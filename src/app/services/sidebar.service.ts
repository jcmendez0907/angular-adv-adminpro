import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {title: 'Dashboard', icon:'mdi mdi-gauge',
    submenu: [
      {title: 'Main', url: '/dashboard'},
      {title: 'Progress', url: 'progress'},
      {title: 'Grafica', url: 'grafica1'},
      {title: 'Promesas', url: 'promesas'},
      {title: 'Rxjs', url: 'rxjs'},
    ]}
  ];
  constructor() { }
}
