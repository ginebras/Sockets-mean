import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  public room:any;
  public sala:String;

  constructor(private _route:ActivatedRoute, private _cookieService:CookieService) {
  }

  ngOnInit(): void {
    this.room=this._route.snapshot.paramMap.get('room');
    this._cookieService.set("Room",this.room);

    this._route.params.subscribe(params=>{
      this.sala=params.sala;
    })
  }

}
