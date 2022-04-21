import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Matiere } from 'src/app/matiere/matiere.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { MatiereService } from 'src/app/shared/matiere.service';
import { UsersService } from 'src/app/shared/users.service';
import { Assignment } from '../assignment.model';
import { Users } from '../users.model';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css'],
})
export class EditAssignmentComponent implements OnInit {
  assignment!: Assignment | undefined;
  nomAssignment!: string;
  dateDeRendu!: Date;
  note!: number;
  remarques!: string;
  idMatiere!: number;
  idEleve!: number;

  matieres: Matiere[] = [];
  eleves : Users[] = [];

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private matiereService :MatiereService, 
    private usersService :UsersService
  ) {}

  ngOnInit(): void {
    // ici un exemple de récupération des query params et du fragment
    let queryParams = this.route.snapshot.queryParams;
    console.log("Query params :")
    console.log(queryParams);
    console.log("Fragment :")
    console.log(this.route.snapshot.fragment);

    this.getAssignment();
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

  getAssignment() {
    // on récupère l'id dans le snapshot passé par le routeur
    // le "+" force l'id de type string en "number"
    const id = +this.route.snapshot.params['id'];

    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      if (!assignment) return;

      this.assignment = assignment;

      // Pour pré-remplir le formulaire
      this.nomAssignment = assignment.nom;
      this.dateDeRendu = assignment.dateDeRendu;
      this.note = assignment.note;
      this.remarques=assignment.remarques;
      this.idMatiere =assignment.idMatiere;
      this.idEleve = assignment.idEleve;
    });
  }

  onSaveAssignment() {
    if (!this.assignment) return;

    // on récupère les valeurs dans le formulaire
    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;
    this.assignment.note = this.note;
    this.assignment.remarques = this.remarques;
    this.assignment.idMatiere = this.idMatiere;
    this.assignment.idEleve = this.idEleve;

    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((reponse) => {
        console.log(reponse.message);

        // navigation vers la home page
        this.router.navigate(['/home']);
      });
  }
}
