import { Component, OnInit } from '@angular/core';
import {Globals} from './globals';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './_services/authentication.service';
import { User } from './_models/user';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Globals]
})
export class AppComponent implements OnInit {

  private role: string;
  private loginInfo: [String, number];
  loggedIn : boolean;

  constructor(private authenticationService: AuthenticationService, private globals: Globals, private router:Router) {
    this.role = globals.role;
    this.loginInfo = globals.loginInfo;
    if(this.authenticationService.currentUserValue){
      this.loggedIn = true;
    }
    
  }

  value = '';
  onEnter(value: string) { 
    this.value = value;
    this.goStats();
  }
  goStats(){
    if(window.location.href.indexOf('http://localhost:4200/stats') != 0){
       //indexOF se usa aca para verificar si
       //pregunta si el indice de algo existe
       //si el index de cierta porcion de la url existe = 0 if not = 1
      this.router.navigate(['/stats'], { queryParams: { id: this.value}});
    }else{
      window.location.search = '?id=' + this.value;
    }
  }

  ngOnInit(){
    console.log(this.role);  
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
    location.reload();
    this.loggedIn = false;
  }

}