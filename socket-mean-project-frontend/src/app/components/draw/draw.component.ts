import { Component, OnInit, ViewChild } from '@angular/core';
import { HostListener, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { SocketWebService } from '../../socket-web.service';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css']
})
export class DrawComponent implements OnInit {
  @ViewChild("canvasRef",{static:false}) canvasRef;
  public isAvaible=false;

  public width=600;
  public height=400;

  public cx:CanvasRenderingContext2D;
  public points:Array<any>;

  @HostListener("document:mousemove",["$event"])
  onMouseMove=(e:any)=>{
    if (e.target.id=="canvasId" && (this.isAvaible)){
      this.write(e);
    }
  }

  @HostListener("click",["$event"])
  onClick=(e:any)=>{
    if (e.target.id=="canvasId")
      this.isAvaible=!this.isAvaible;
  }

  constructor(private _socketWebService:SocketWebService) {
    this.points=[];
    this._socketWebService.outEven.subscribe(res=>{
      const { prevPos } = res;
      this.writeSingle(prevPos,false); 
    })
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit():void{
    this.render();
  }

  private render(){
    const canvasEl=this.canvasRef.nativeElement;
    this.cx=canvasEl.getContext('2d');

    canvasEl.width=this.width;
    canvasEl.height=this.height;  

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
  }

  private write(res){
    const canvasEl=this.canvasRef.nativeElement;
    const rect=canvasEl.getBoundingClientRect();
    var pos={
      x: res.clientX- rect.left,
      y: res.clientY - rect.top
    };

    this.writeSingle(pos,true);
  }

  private writeSingle=(pos,emit:boolean)=>{
    this.points.push(pos);
    if (this.points.length>3){
      var currentPos=this.points[this.points.length -1];
      var prevPos=this.points[this.points.length -2];
      
      this.drawOnCanvas(currentPos, prevPos);

      if(emit){
        this._socketWebService.emitEvent({prevPos});
      }
    }
  }

  private drawOnCanvas(currentPos, prevPos){
    if (!this.cx) return;

    this.cx.beginPath();
    if (prevPos){
      this.cx.moveTo(prevPos.x,prevPos.y);
      this.cx.lineTo(currentPos.x,currentPos.y);
      this.cx.stroke();
    } 
  }

  public clean(){
    this.points=[];
    this.cx.clearRect(0,0,this.width,this.height);
  }
}
