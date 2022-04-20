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
    

    this.authService.register(this.nom, this.password, this.cardImageBase64, this.profil)
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


  
  imageError!: string;
  isImageSaved!: boolean;
  cardImageBase64!: string;

  fileChangeEvent(fileInput: any) {
    this.imageError = "null";
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        if (fileInput.target.files[0].size > max_size) {
            this.imageError =
                'Maximum size allowed is ' + max_size / 1000 + 'Mb';
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                  const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;
                    this.isImageSaved = true;
                    // this.previewImagePath = imgBase64Path;
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }

}


}
