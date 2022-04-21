import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, forkJoin, map, Observable, of, pairwise, tap } from 'rxjs';
import { Matiere } from '../matiere/matiere.model';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})

export class MatiereService {
  matiere:Matiere[] = [];

  url = "http://localhost:8010/api/matiere";
  constructor(private loggingService:LoggingService, private http:HttpClient) {
    this.loggingService.setNiveauTrace(2);
  }

  getMatieres():Observable<any> {
    return this.http.get<Matiere[]>(this.url);
  }

  // getMatieres(page:number, limit:number):Observable<any> {
  //   return this.http.get<Matiere[]>(this.url + "?page=" + page + "&limit=" + limit);
  // }

  getMatiere(id:number):Observable<Matiere|undefined> {
    return this.http.get<Matiere>(`${this.url}/${id}`)
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

  addMatiere(matiere:Matiere):Observable<any> {
    this.loggingService.log(matiere.nom, "ajouté");
    return this.http.post<Matiere>(this.url, matiere);
  }

  updateMatiere(matiere:Matiere):Observable<any> {
    this.loggingService.log(matiere.nom, "modifié");

    return this.http.put<Matiere>(this.url, matiere);
  }

  deleteMatiere(matiere:Matiere):Observable<any> {
    this.loggingService.log(matiere.nom, "supprimé");
    return this.http.delete(this.url + "/" + matiere._id);
  }

  
  

}
