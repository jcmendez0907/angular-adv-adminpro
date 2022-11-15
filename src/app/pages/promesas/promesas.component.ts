import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // const promesa = new Promise( (resolve)=>{
    //   resolve('Hola Mundo..');

    // });

    // promesa.then((result)=>{
    //   console.log(result);
    // }).catch((error)=>{
    //   console.log(error);

    // })
    // console.log('Fin del init..');
    this.getUsuarios().then((usuarios)=>{
      console.log(usuarios);

    })

  }

  getUsuarios(){
    const promesa = new Promise(resolve => {
      fetch('https://reqres.in/api/users')
      .then(resp=>resp.json())
      .then(body =>resolve(body.data));
    });
    return promesa;
  }

}
