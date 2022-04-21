import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersWithoutPassword } from '../assignments/users.model';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  token:string = "";
  users: UsersWithoutPassword = new UsersWithoutPassword;
  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
    console.log("NavbarComponent.ngOnInit()") ;
    if(sessionStorage.getItem('token') != null){
      this.token = sessionStorage.getItem('token')!;
      console.log("token: " + this.token);
      this.authService.getLoggedIn(this.token).subscribe(reponse => {
        var userT = reponse as UsersWithoutPassword;
        this.users = userT;
        console.log("users: " + JSON.stringify(this.users));
      }, error => {
        console.log("erreur = " + error.error);
      });
    }
  }

  transformProfil(profil:Number):string{
    switch(profil){
      case 10:
        return "Etudiant";
      case 20:
        return "Professeur";
      case 30:
        return "Administrateur";
      default:
        return "";
    }
  }

  deco(){
    this.authService.logOut().subscribe(reponse => {
      sessionStorage.removeItem('token');
      this.router.navigate(["/login"]);
    });
  }

}
