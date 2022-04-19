import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { MatiereService } from 'src/app/shared/matiere.service';
import { Assignment } from '../assignment.model';
import { Matiere } from '../../matiere/matiere.model';
import { Users } from '../users.model';
import { UsersService } from 'src/app/shared/users.service';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  // Champ de formulaire
  nomAssignment!: string;
  dateDeRendu!: Date;
  note!: number;
  remarques!: string;
  idMatiere!: number;
  idEleve!: number;
  matieres: Matiere[] = [];
  eleves : Users[] = [];
  

  constructor(private assignmentsService:AssignmentsService, private router:Router,private matiereService :MatiereService, private usersService :UsersService ) {}

  ngOnInit(): void {
    this.matiereService.getMatieres()
      .subscribe(reponse => {
        this.matieres = reponse.docs;
        console.log(reponse.docs);
      });

      this.usersService.getUserByProfil(10)
      .subscribe(reponse => {
        this.eleves = reponse;
        console.log(reponse);
      });
  }

  onSubmit() {
    if((!this.nomAssignment) || (!this.dateDeRendu)) return;
    console.log(
      'nom = ' + this.nomAssignment + ' date de rendu = ' + this.dateDeRendu + ' matiere = ' + this.idMatiere
    );

    let newAssignment = new Assignment();
    newAssignment.id = Math.round(Math.random()*10000000);
    newAssignment.nom = this.nomAssignment;
    newAssignment.dateDeRendu = this.dateDeRendu;
    newAssignment.rendu = false;
    newAssignment.note = 0;
    newAssignment.remarques = " ";
    newAssignment.idMatiere = this.idMatiere ;
    newAssignment.idEleve = this.idEleve;

    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(reponse => {
      console.log(reponse.message);

      // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
      // en gros, demander de naviguer vers /home
      this.router.navigate(["/home"]);
    })
  }
}
