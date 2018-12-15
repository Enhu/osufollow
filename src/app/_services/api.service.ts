import { Injectable } from '@angular/core';
import { HttpClient} from  '@angular/common/http';
import { Observable } from 'rxjs';
import * as configJson from '../config.json';
import {User} from '../_models/user';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export default class  APIService {
  constructor(private  httpClient:  HttpClient) {}

  //osu! API calls
  getUserInfo(value: string){
      return  this.httpClient.get(`${configJson.OSU_API_URL}/get_user?k=` + configJson.API_KEY + '&u=' + value);
  }
  getUserBest(value: string){
    return  this.httpClient.get(`${configJson.OSU_API_URL}}/get_user_best?k=` + configJson.API_KEY + '&u=' + value);
  }
  getUserRecent(value: string){
    return  this.httpClient.get(`${configJson.OSU_API_URL}}/get_user_recent?k=` + configJson.API_KEY + '&u=' + value);
  }
  getBeatmapInfo(value: string){
    return  this.httpClient.get(`${configJson.OSU_API_URL}}/get_beatmaps?k=` + configJson.API_KEY + '&b=' + value);
  }


//Database Calls
getAllUsers() : Observable<Array<User>> {
    return this.httpClient.get<Array<User>>(`http://localhost:8080/api/Users`);
}

getUsers(){
    this.httpClient.get('http://localhost:8080/api/Users').subscribe((res : any) => {
        return res;
      });
}

getUserByUsername(username: string) {
    return this.httpClient.get(`${configJson.DATABASE_API_URL}/Users/${username}`);
}

registerUser (user: User): Observable<string>{
    return this.httpClient.post<string>(`${configJson.DATABASE_API_URL}/users/register`, user)
}

updateUser(user: User) {
    return this.httpClient.put(`${configJson.DATABASE_API_URL}/Users/update?username=${user.username}`, user);
}

deleteUser(id: number) {
    return this.httpClient.delete(`${configJson.DATABASE_API_URL}/Users/${id}`);
}
}
