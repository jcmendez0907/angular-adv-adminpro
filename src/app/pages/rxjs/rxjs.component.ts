import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, retry, interval, take , map, filter, Subscription} from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;
  constructor() {




    // this.retornarObservable().pipe(
    //   retry(2)
    // ).subscribe(
    //   (valor)=>console.log('subs: ', valor),
    //   (err)=> console.log('Eroor ', err),
    //   () => console.info(' Obs terminado ..')

    // );
    this.intervalSubs = this.retornaInvervalo().subscribe(console.log)


   }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

   retornaInvervalo(){
    return interval(200)
    .pipe(
      take(10),
      map( valor => valor + 1),
      filter(valor => (valor % 2 === 0 ) ? true : false),

    )
   }
   retornarObservable(){
    let i = -1;

    return new Observable<number>( observer =>{

      const intervalo = setInterval(()=>{
        i++;
        observer.next(i);
        if( i=== 4){
          clearInterval( intervalo);
          observer.complete();
        }
        if(i === 2){
          observer.error('i llego a 2')
        }
      }, 1000)
    });

   }



}
