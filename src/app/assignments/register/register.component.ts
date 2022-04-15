import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  nom !: string;
  password !: string;
  photo !: string;
  profil !: Number;

  constructor(private authService:AuthService, private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.authService.register(this.nom, this.password, this.photo, this.profil)
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
