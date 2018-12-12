import { Component, OnInit } from '@angular/core';
import { APIService } from  '../api.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient} from  '@angular/common/http';
import { Observable } from 'rxjs';
import { debug } from 'util';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  userParam : string;
  avatarUrl : string;
  private  users:  Array<object> = [];
  private  bestScores:  Array<object> = [];
  private  recentScores : Array<object> = [];
  
  constructor(private  apiService:  APIService, private router: ActivatedRoute, private httpClient: HttpClient) { 
  }

  async getUserInfo(){
    this.apiService.getUserInfo(this.userParam).subscribe((data:  Array<object>) => {
        this.users  =  data;
        this.avatarUrl = 'https://a.ppy.sh/' + data['0']['user_id'];
        this.getAvatar(this.avatarUrl)
        this.getUserBest();
        this.getUserRecent();
    });
}

async getBeatmapInfo(beatmapID : string, maxcombo : string, pp : string, rank : string, request : string){
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

async getUserBest(){
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

async getUserRecent(){
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

  ngOnInit() {
    this.userParam  = this.router.snapshot.queryParamMap.get('id');
    this.getUserInfo();
  }

}
