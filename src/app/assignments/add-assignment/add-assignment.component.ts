import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { MatiereService } from 'src/app/shared/matiere.service';
import { Assignment } from '../assignment.model';
import { Matiere } from '../../matiere/matiere.model';
import { Users } from '../users.model';
import { UsersService } from 'src/app/shared/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;
  matiere:Matiere[] = [];
  eleve:Users[] =[];
  prof:Users[] =[];
  users:Users[] =[];

  constructor(private assignmentsService:AssignmentsService, private router:Router,private matiereService :MatiereService, private usersService :UsersService,private _formBuilder: FormBuilder ) {}

  ngOnInit(): void {
    this.getMatiere();
    this.getUsers();
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
      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
      });
      this.thirdFormGroup = this._formBuilder.group({
        thirdCtrl: ['', Validators.required],
      });
      this.fourthFormGroup = this._formBuilder.group({
        fourthCtrl: ['', Validators.required],
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

  SaveAssign() {
    if((!this.firstFormGroup.value.firstCtrl) || (!this.secondFormGroup.value.secondCtrl)) return;
    console.log(
      'nom = ' + this.firstFormGroup.value.firstCtrl + ' date de rendu = ' + this.secondFormGroup.value.secondCtrl + ' matiere = ' + this.thirdFormGroup.value.thirdCtrl + ' eleve = ' + this.fourthFormGroup.value.fourthCtrl
    );
    let newAssignment = new Assignment();
    newAssignment.id = Math.round(Math.random()*10000000);
    newAssignment.nom = this.firstFormGroup.value.firstCtrl;
    newAssignment.dateDeRendu = this.secondFormGroup.value.secondCtrl;
    newAssignment.rendu = false;
    newAssignment.note = 0;
    newAssignment.remarques = " ";
    newAssignment.idMatiere = this.thirdFormGroup.value.thirdCtrl; ;
    newAssignment.idEleve = this.fourthFormGroup.value.fourthCtrl;

    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(reponse => {
      console.log(reponse.message);

      // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
      // en gros, demander de naviguer vers /home
      this.router.navigate(["/home"]);
    })
  }

  getUsers() {
    this.usersService.getUsers()
    .subscribe(reponse => {
      this.users = reponse.docs;
      this.eleve = this.users.filter(a=>a.profil == 10);
      this.prof = this.users.filter(a=>a.profil == 20);
    });
  }
  
  getMatiere() {
    this.matiereService.getMatieres()
    .subscribe(reponse => {
      this.matiere = reponse.docs;
    });
  }
  
  getMatierebyId(id: Number){
    var mat = this.matiere.find(e => e.id == id );
    return mat
  }

  getElevebyId(id: Number){
  var a = this.eleve.find(e => e.id == id );
  return a
  }
}
