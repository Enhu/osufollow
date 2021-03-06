import { Component, OnInit } from '@angular/core';
import {APIService}  from  '../_services/api.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient} from  '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { debug } from 'util';
import { AuthenticationService } from '../_services/authentication.service';
import $ from "jquery";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  followForm: FormGroup;
  buttonValue : string = 'Follow this user!';
  loggedIn: boolean = false;
  userParam : string;
  avatarUrl : string;
  users:  Array<object> = [];
  bestScores:  Array<object> = [];
  recentScores : Array<object> = [];
  
  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService, 
    private authenticationService: AuthenticationService,
     private  apiService:  APIService, 
     private router: ActivatedRoute, 
     private httpClient: HttpClient) { 
  }

  public getUserInfo(){
    this.apiService.getUserInfo(this.userParam).subscribe((data:  Array<object>) => {
        this.users  =  data;
        console.log(this.users);
        if(this.users.length > 0){
          this.avatarUrl = 'https://a.ppy.sh/' + data['0']['user_id'];
          this.getAvatar(this.avatarUrl)
          this.getUserBest();
          this.getUserRecent();
        }else{
          this.loggedIn = false;

        }
        
    });
}

public getBeatmapInfo(beatmapID : string, maxcombo : string, pp : string, rank : string, request : string){
  this.apiService.getBeatmapInfo(beatmapID).subscribe((data:  Array<object>) => {
    data['0']['maxcombo'] = maxcombo;
    data['0']['pp'] = pp;
    data['0']['rank'] = rank;
    if (request == 'best'){
      this.bestScores.push(data);
    }else{
      this.recentScores.push(data);
    }
});
}

public getUserBest(){
  this.apiService.getUserBest(this.userParam).subscribe((data:  Array<object>) => {
    var request = 'best'
    var beatmapID = '';
    var maxcombo = '';
    var pp = '';
    var rank = '';
    for (var i in data){
      beatmapID = data[i]['beatmap_id'];
      maxcombo = data[i]['maxcombo'];
      pp = data[i]['pp'];
      rank = data[i]['rank'];
      this.getBeatmapInfo(beatmapID, maxcombo, pp, rank, request);
    }
});
}

public getUserRecent(){
  this.apiService.getUserRecent(this.userParam).subscribe((data:  Array<object>) => {
    var request = 'recent';
    var beatmapID = '';
    var maxcombo = '';
    var pp = '';
    var rank = '';
    for (var i in data){
      beatmapID = data[i]['beatmap_id'];
      maxcombo = data[i]['maxcombo'];
      pp = data[i]['pp'];
      rank = data[i]['rank'];
      this.getBeatmapInfo(beatmapID, maxcombo, pp, rank, request);
    }
});
}


getAvatar(imageUrl: string): Observable<Blob> {
  return this.httpClient.get(imageUrl, { responseType: 'blob' });
}

followOrUnfollowUser(){
  let currentUser =  JSON.parse(localStorage.getItem('currentUser'));
  let playerName = this.userParam;
  if(this.buttonValue == 'Unfollow user'){
    if(currentUser != null){
      this.apiService.stopFollowingPlayer(playerName).subscribe(
      data =>{
        console.log("success");
        $.each(currentUser.follows, function(i, item){
          if(item.osuFollowedUser == playerName){
           currentUser.follows[i]['osuFollowedUser'] = null;
           }});
        localStorage.setItem('currentUser', JSON.stringify(currentUser))   
        location.reload();
      },
      error =>{
        console.log(error)
      });
  
    }
  }else
  {
  if(currentUser != null){
    this.apiService.followOsuUser(this.followForm.value).subscribe(
    data =>{
      console.log("success");
      currentUser.follows.push({"username": currentUser.user ,"osuFollowedUser": this.userParam })
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      location.reload();
    },
    error =>{
      console.log(error)
    });

  }
 }
}

  ngOnInit() {

    let currentUser =  JSON.parse(localStorage.getItem('currentUser'));
    this.userParam  = this.router.snapshot.queryParamMap.get('id');
    let playerName = this.userParam;
    
    if(playerName != null){
    this.getUserInfo();

    if(currentUser != null){
      this.loggedIn = true;

      currentUser.follows.forEach(element => {
        if(element.osuFollowedUser == playerName){
          this.buttonValue = 'Unfollow user'
        }
      });

      this.followForm = this.formBuilder.group({
        username: currentUser.user,
        osuFollowedUser: this.userParam
     })
    }
  }
  }

}
