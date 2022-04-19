import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, forkJoin, map, Observable, of, pairwise, tap } from 'rxjs';
import { Users } from '../assignments//users.model';
import { LoggingService } from './logging.service';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  user:Users[] = [];

  url = "http://localhost:8010/api/user";
  constructor(private loggingService:LoggingService, private http:HttpClient) {
    this.loggingService.setNiveauTrace(2);
  }

  getUsers(page:number, limit:number):Observable<any> {
    return this.http.get<Users[]>(this.url + "?page=" + page + "&limit=" + limit);
  }

  getUserByProfil(profil:number):Observable<any> {
    return this.http.get<Users[]>(`${this.url}/${profil}`)
  }

}