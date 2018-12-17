import { Component, OnInit, Input } from '@angular/core';
import {Globals} from './globals';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';
import { Subscription } from 'rxjs';
import {APIService}   from './_services/api.service';
import { AuthenticationService } from './_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Globals]
})
export class AppComponent implements OnInit {

  recentScores: any;
  private role: string;
  private loginInfo: [String, number];
  loggedIn : boolean;

  constructor(private toastr: ToastrService, private apiService : APIService, private authenticationService: AuthenticationService, private globals: Globals, private router:Router) {
    this.role = globals.role;
    this.loginInfo = globals.loginInfo;
    if(this.authenticationService.currentUserValue){
      this.loggedIn = true;
    }else{
      this.loggedIn = false;
    }
    
  }

  value = '';
  onEnter(value: string) { 
    this.value = value;
    this.goStats();
  }
  goStats(){
    if(window.location.href.indexOf('https://osufollow.herokuapp.com/stats') != 0){
       //indexOF se usa aca para verificar si
       //pregunta si el indice de algo existe
       //si el index de cierta porcion de la url existe = 0 if not = 1
      this.router.navigate(['/stats'], { queryParams: { id: this.value}});
    }else{
      window.location.search = '?id=' + this.value;
    }
  }

  ngOnInit(){
    
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
    location.reload();
  }

}