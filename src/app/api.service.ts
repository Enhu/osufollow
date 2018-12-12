import { Injectable } from '@angular/core';
import { HttpClient} from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export  class  APIService {
  API_KEY = '?k=0ca202de6d1c269607b667734418251e5d810a2a';
  API_URL  =  'https://osu.ppy.sh/api/';
  constructor(private  httpClient:  HttpClient) {}
  getUserInfo(value: string){
      return  this.httpClient.get(`${this.API_URL}/get_user` + this.API_KEY + '&u=' + value);
  }
  getUserBest(value: string){
    return  this.httpClient.get(`${this.API_URL}/get_user_best` + this.API_KEY + '&u=' + value);
  }
  getUserRecent(value: string){
    return  this.httpClient.get(`${this.API_URL}/get_user_recent` + this.API_KEY + '&u=' + value);
  }
  getBeatmapInfo(value: string){
    return  this.httpClient.get(`${this.API_URL}/get_beatmaps` + this.API_KEY + '&b=' + value);
  }
}
