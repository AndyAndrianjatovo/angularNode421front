import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Users } from '../assignments/users.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;

  logIn(nom:string, password:string) {
    // normalement il faudrait envoyer une requête sur un web service, passer le login et le password
    // et recevoir un token d'authentification, etc. etc.
    return this.http.post('http://localhost:8010/api/auth/login', {nom, password});
    // pour le moment, si on appelle cette méthode, on ne vérifie rien et on se loggue
    this.loggedIn = true;
  }

  register(nom:string, password:string, photo:string, profil:Number) {
    return this.http.post('http://localhost:8010/api/auth/register', {nom, password, photo, profil});
  }

  getLoggedIn(token:string) {
    return this.http.get('http://localhost:8010/api/auth/me', {headers: {'x-access-token': token}});
  }

  logOut() {
    return this.http.get('http://localhost:8010/api/auth/logout');
  }

  isAdmin() {
    let isUserAdmin = new Promise((resolve, reject) => {
      resolve(sessionStorage.getItem("token"));
    });
    //return this.loggedIn;
    return isUserAdmin;
  }

  // isAdmin().then(admin => { if(admin) { console.log("L'utilisateur est administrateur"); }})

  constructor(private http:HttpClient) { }
}
