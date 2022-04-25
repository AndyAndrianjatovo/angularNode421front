import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Matiere } from 'src/app/matiere/matiere.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { AuthService } from 'src/app/shared/auth.service';
import { MatiereService } from 'src/app/shared/matiere.service';
import { UsersService } from 'src/app/shared/users.service';
import { Assignment } from '../assignment.model';
import { Users, UsersWithoutPassword } from '../users.model';
import { MatDialog } from '@angular/material/dialog';
import { NoterComponent } from '../noter/noter.component';
import { EditAssignmentComponent } from '../edit-assignment/edit-assignment.component';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis!: Assignment;
  matiere!: Matiere;
  eleve!: Users;
  prof!: Users;

  @Input()
  assignmentTodisplay!: Assignment;
  @Input()
  matiereTodisplay!: Matiere;
  @Input()
  profTodisplay!: Users;
  @Input()
  eleveTodisplay!: Users;


  token:string = "";
  users: UsersWithoutPassword = new UsersWithoutPassword;
  
  @Output() eventClose = new EventEmitter<string>();

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
    if (!this.assignmentTodisplay) return;

    this.assignmentsService
      .deleteAssignment(this.assignmentTodisplay)
      .subscribe((reponse) => {
        console.log(reponse.message);
        // et on navigue vers la page d'accueil pour afficher la liste
        this.eventClose.emit('close');
        this.router.navigate(['/home']);
      });

  }

  onClickEdit() {
    this.router.navigate(['/assignment', this.assignmentTodisplay.id, 'edit'], {
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

  openEditDevoir(){
    const dialogRef = this.dialog.open(EditAssignmentComponent,{maxWidth:'35vw'});
  }
}
