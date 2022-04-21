import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, NgZone, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs';
import { Matiere } from '../matiere/matiere.model';
import { AssignmentsService } from '../shared/assignments.service';
import { MatiereService } from '../shared/matiere.service';
import { UsersService } from '../shared/users.service';
import { Assignment } from './assignment.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NoterComponent } from './noter/noter.component';
import { Users } from './users.model';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AssignmentsComponent implements OnInit, AfterViewInit {
  assignments:Assignment[] = [];
  displayedColumns: string[] = ['id', 'nom', 'dateDeRendu', 'rendu','note','remarques','idMatiere','idEleve'];

  matiere:Matiere[] = [];
  eleve:Users[] =[];
  prof:Users[] =[];
  users:Users[] =[];
  rendu:Assignment[] = [];
  nonRendu:Assignment[] = [];
  selectedDate: Date | null = new Date();
  afaireToday:Assignment[] | undefined = [];
  
  // pagination
  page=1;
  limit=10000;
  totalPages=0;
  pagingCounter=0;
  hasPrevPage=false;
  hasNextPage=true;
  prevPage= 1;
  nextPage= 2;

  token: any;

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    this.getAssignmentsByDate();
    if (view === 'month') {
      const date = cellDate.getDate();
      let a = "";
      for(let i=0; i<this.afaireToday!.length; i++){
        a += `${date} === ${this.afaireToday![i].dateDeRendu}`;
        if(i != this.afaireToday!.length-1) a += " || ";
      }
      console.log(a);

      // Highlight the 1st and 20th day of each month.
      return a ? 'datyMisyEvent' : '';
    }

    return '';
  };

  constructor(private assignmentsService:AssignmentsService, private ngZone: NgZone , private matiereService:MatiereService, private usersService:UsersService,public dialog: MatDialog) {}



  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  ngAfterViewInit():void{
    // this.scroller.elementScrolled().pipe(
    //   tap(event => {
    //     //console.log(event);
    //   }),
    //   map(event => {
    //     return this.scroller.measureScrollOffset('bottom');
    //   }),
    //   tap(val => {
    //     //console.log("distance par rapport à la fin = " + val)
    //   }),
    //   pairwise(),
    //   tap(val => {
    //     /*
    //     if(val[0] < val[1]) console.log("on monte")
    //     else console.log("on descend")
    //     */
    //   }),
    //   filter(([y1, y2]) => (y2 < y1 && y2 < 140)),
    //   tap(val => {
    //     //console.log(val)
    //   }),
    //   throttleTime(200),
    //   tap(val => {
    //     //console.log(val);
    //   })
    // ).subscribe(() => {
    //   // ici traitement final
    //   console.log("On va chercher de nouveaux assignments !")

    //   // on le fait en tache de fond...
    //   this.ngZone.run(() => {
    //     this.page = this.nextPage;
    //     this.getAssignmentsScrollInfini();
    //   })
    // })
  }

  // appelé après le constructeur et AVANT l'affichage du composant
  ngOnInit(): void {
    console.log("Dans ngOnInit, appelé avant l'affichage");
    this.token = sessionStorage.getItem('token');
    this.getAssignments(this.token);
    this.getMatiere();
    this.getUsers();
    this.getAssignmentsByDate();
  }

  
  getAssignments(token: any) {
      // demander les données au service de gestion des assignments...
      this.assignmentsService.getAssignments(this.page, this.limit,token)
      .subscribe(reponse => {
        console.log("données arrivées");
        this.assignments = reponse.docs;
        this.page = reponse.page;
        this.limit=reponse.limit;
        this.totalPages=reponse.totalPages;
        this.pagingCounter=reponse.pagingCounter;
        this.hasPrevPage=reponse.hasPrevPage;
        this.hasNextPage=reponse.hasNextPage;
        this.prevPage= reponse.prevPage;
        this.nextPage= reponse.nextPage;
        this.rendu = this.assignments.filter(x=>x.rendu == true);
        this.nonRendu = this.assignments.filter(x=>x.rendu == false);
      });

      console.log("Après l'appel au service");
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

getProfbyId(id: Number){
  var a = this.prof.find(e => e.id == id );
  return a
}

drop(event: CdkDragDrop<Assignment[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    this.openDialog(event.previousContainer.data[event.previousIndex],event);
  }
}


openDialog( devoir: Assignment , event: CdkDragDrop<Assignment[]>): void {
  const dialogRef = this.dialog.open(NoterComponent,
    {
      data: { assign: devoir , evenement : event }
    });
}







  getAssignmentsScrollInfini() {
    // demander les données au service de gestion des assignments...
    this.assignmentsService.getAssignments(this.page, this.limit,this.token)
    .subscribe(reponse => {
      console.log("données arrivées");
      //this.assignments = reponse.docs;
      // au lieu de remplacer les assignments chargés par les nouveaux, on les ajoute
      this.assignments = this.assignments.concat(reponse.docs);

      this.page = reponse.page;
      this.limit=reponse.limit;
      this.totalPages=reponse.totalPages;
      this.pagingCounter=reponse.pagingCounter;
      this.hasPrevPage=reponse.hasPrevPage;
      this.hasNextPage=reponse.hasNextPage;
      this.prevPage= reponse.prevPage;
      this.nextPage= reponse.nextPage;
    });

    console.log("Après l'appel au service");
}

  pagePrecedente() {
    this.page--;
    this.getAssignments(this.token);
  }

  pageSuivante() {
    this.page++;
    this.getAssignments(this.token);
  }

  premierePage() {
    this.page = 1;
    this.getAssignments(this.token);
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignments(this.token);
  }

  getAssignmentsByDate() {
    this.afaireToday = [];
    this.assignments.filter(e => {
      var a:Date = e.dateDeRendu;
      var b = new Date(a);
      if(b.toDateString() === this.selectedDate?.toDateString()) {
        this.afaireToday?.push(e);
      }
    });
  }

}
