import { Component, OnInit } from '@angular/core';
import {Globals} from './globals';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Globals]
})
export class AppComponent implements OnInit {

  private role: string;
  private loginInfo: boolean;

  constructor(private globals: Globals) {
    this.role = globals.role;
    this.loginInfo = globals.loginInfo;
  }

  ngOnInit(){
   console.log(this.role);



  }

}
