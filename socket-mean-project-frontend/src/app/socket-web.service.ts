import { EventEmitter,Injectable,Output } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket{
  @Output() outEven:EventEmitter<any>=new EventEmitter();

  constructor(private cookieService:CookieService){
    super({
      url:"http://localhost:3700",
      options:{
        query:{
          nameRoom:cookieService.get("Room")
        }
      }
    })
    this.listen();
  }


  listen=()=>{
    this.ioSocket.on('event',res=>this.outEven.emit(res));
  }

  emitEvent=(payload = {})=>{
    this.ioSocket.emit('event',payload);
  }
}
