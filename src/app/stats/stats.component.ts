import { Component, OnInit } from '@angular/core';
import { APIService } from  '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  
  userParam : string;
  private  users:  Array<object> = [];
  constructor(private  apiService:  APIService, private router: ActivatedRoute) { 
  }

  public getUserInfo(){
    debugger;
    this.apiService.getUserInfo(this.userParam).subscribe((data:  Array<object>) => {
        this.users  =  data;
        console.log(data);
    });
}

  ngOnInit() {
    debugger;
    this.userParam  = this.router.snapshot.queryParamMap.get('id');
    this.getUserInfo();
  }

}
