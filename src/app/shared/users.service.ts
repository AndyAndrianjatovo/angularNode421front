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

  url = "https://nodeangular421api.herokuapp.com/api/user";
  constructor(private loggingService:LoggingService, private http:HttpClient) {
    this.loggingService.setNiveauTrace(2);
  }

  getUsers():Observable<any> {
    return this.http.get<Users[]>(this.url);
  }

  getUserByProfil(profil:number):Observable<any> {
    return this.http.get<Users[]>(`https://nodeangular421api.herokuapp.com/api/users/${profil}`)
  }

  getUser(id:number):Observable<any> {
    return this.http.get<Users>(`${this.url}/${id}`)
    .pipe(
      map(a => {
        a.nom = a.nom ;
        return a;
      }),
      tap(a => {
        console.log("Dans le tap, pour debug, matiere recu = " + a.nom)
      }),
      catchError(this.handleError<any>('### catchError: getMatiere by id avec id=' + id))
    );
  }
  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    }
  }

}
