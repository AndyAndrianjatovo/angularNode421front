import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nom !: string;
  password !: string;

  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.authService.logIn(this.nom, this.password)
    .subscribe(reponse => {
      console.log(reponse);

      // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
      // en gros, demander de naviguer vers /home
      this.router.navigate(["/home"]);
    }, error => {
        console
        .log("erreur  " + error);
    })
  }

}
