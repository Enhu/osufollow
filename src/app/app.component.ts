import { Component, OnInit } from '@angular/core';
import {Globals} from './globals';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Globals]
})
export class AppComponent implements OnInit {

  private role: string;
  private loginInfo: [String, number];

  constructor(private globals: Globals, private router:Router) {
    this.role = globals.role;
    this.loginInfo = globals.loginInfo;
  }

  value = '';
  onEnter(value: string) { 
    debugger;
    this.value = value;
    this.goStats();
  }
  goStats(){
    if(window.location.href.indexOf('http://localhost:4200/stats') != 0){
      this.router.navigate(['/stats'], { queryParams: { id: this.value}});
    }else{
      window.location.search = '?id=' + this.value;
    }
  }

  ngOnInit(){
    console.log(this.role);  
  }

}