import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Matiere } from 'src/app/matiere/matiere.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { AuthService } from 'src/app/shared/auth.service';
import { MatiereService } from 'src/app/shared/matiere.service';
import { UsersService } from 'src/app/shared/users.service';
import { Assignment } from '../assignment.model';
import { Users } from '../users.model';
import { MatDialog } from '@angular/material/dialog';
import { NoterComponent } from '../noter/noter.component';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis!: Assignment;
  matiere!: Matiere;
  eleve!: Users;
  prof!: Users;

  constructor(
    private assignmentsService: AssignmentsService, 
    private matiereService:MatiereService,
    private usersService:UsersService,
    private authService:AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // on va récupérer l'id dans l'URL,
    // le + permet de forcer en number (au lieu de string)
    const id = +this.route.snapshot.params['id'];
    this.getAssignmentAsync(id);
 
  }

  getMatiere(id: number) {
    // on demande au service de gestion des assignment,
    // l'assignment qui a cet id !
    this.matiereService.getMatiere(id).subscribe((result) => {
      this.matiere = result! ;
      this.getProf(result!.idProf);
    });
    
  }

  getProf(id: number) {
    // on demande au service de gestion des assignment,
    // l'assignment qui a cet id !
    this.usersService.getUser(id).subscribe((result) => {
      this.prof = result;
    });
  }

  getEleve(id: number) {
    this.usersService.getUser(id).subscribe((result) => {
      this.eleve = result!;
    });
  }

  getAssignment(id: number) {
    // on demande au service de gestion des assignment,
    // l'assignment qui a cet id !
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignmentTransmis = assignment!;
      console.log(assignment);
      this.getMatiere(assignment!.idMatiere);
      this.getEleve(assignment!.idEleve);
    });
  
  }
  getAssignmentAsync(id: number) {
    // on demande au service de gestion des assignment,
    // l'assignment qui a cet id !
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignmentTransmis = assignment!;
      let p =  new Promise((resolve, reject) => {
        resolve(this.assignmentTransmis);
      }).then(
        assignment => {
          this.getMatiere((assignment as Assignment).idMatiere);
          this.getEleve((assignment as Assignment).idEleve);
          console.log(this.eleve);
        }
      ).catch(
        error => console.error(error)
      )
    });
  
  }

  onAssignmentRendu() {
    if (this.assignmentTransmis) {
      const dialogRef = this.dialog.open(NoterComponent,
        {
          data: { assign: this.assignmentTransmis , evenement : null }
        });

      // this.assignmentTransmis.rendu = true;

      // this.assignmentsService
      //   .updateAssignment(this.assignmentTransmis)
      //   .subscribe((reponse) => {
      //     console.log(reponse.message);
      //     // et on navigue vers la page d'accueil pour afficher la liste
      //     this.router.navigate(['/home']);
      //   });
    }
  }

  onDelete() {
    if (!this.assignmentTransmis) return;

    this.assignmentsService
      .deleteAssignment(this.assignmentTransmis)
      .subscribe((reponse) => {
        console.log(reponse.message);
        // et on navigue vers la page d'accueil pour afficher la liste
        this.router.navigate(['/home']);
      });
  }

  onClickEdit() {
    this.router.navigate(['/assignment', this.assignmentTransmis?.id, 'edit'], {
      queryParams: {
        name: 'Michel Buffa',
        job: 'Professeur',
      },
      fragment: 'edition',
    });
  }

  isLoggedIn() {
    return this.authService.loggedIn;
  }
}
