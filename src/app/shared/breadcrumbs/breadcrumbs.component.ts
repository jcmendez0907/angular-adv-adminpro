import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import {  Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators'

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent implements OnDestroy{

  public titulo: string = '';
  public tituloSubs$: Subscription;
  constructor( private router: Router) {
     this.tituloSubs$ = this.getArgsRuta()
     .subscribe(({titulo}) => {
          this.titulo = titulo;
          document.title = `AdminPro - ${titulo}`;
        });
   }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

   getArgsRuta(): Observable<any>{
    return this.router.events
    .pipe(
        filter((response: any) => response instanceof ActivationEnd),
        filter( (response :ActivationEnd)=> response.snapshot.firstChild === null ),
        map( (response: ActivationEnd) => response.snapshot.data)
    );

   }

}
