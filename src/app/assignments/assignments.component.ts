import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs';
import { Matiere } from '../matiere/matiere.model';
import { AssignmentsService } from '../shared/assignments.service';
import { MatiereService } from '../shared/matiere.service';
import { UsersService } from '../shared/users.service';
import { Assignment } from './assignment.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit, AfterViewInit {
  assignments:Assignment[] = [];
  displayedColumns: string[] = ['id', 'nom', 'dateDeRendu', 'rendu','note','remarques','idMatiere','idEleve'];

  matiere:Matiere[] = [];
  rendu:Assignment[] = [];
  nonRendu:Assignment[] = [];
  // pagination
  page=1;
  limit=10;
  totalPages=0;
  pagingCounter=0;
  hasPrevPage=false;
  hasNextPage=true;
  prevPage= 1;
  nextPage= 2;

  token: any;

  constructor(private assignmentsService:AssignmentsService, private ngZone: NgZone , private matiereService:MatiereService) {}

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  ngAfterViewInit():void{
    this.scroller.elementScrolled().pipe(
      tap(event => {
        //console.log(event);
      }),
      map(event => {
        return this.scroller.measureScrollOffset('bottom');
      }),
      tap(val => {
        //console.log("distance par rapport à la fin = " + val)
      }),
      pairwise(),
      tap(val => {
        /*
        if(val[0] < val[1]) console.log("on monte")
        else console.log("on descend")
        */
      }),
      filter(([y1, y2]) => (y2 < y1 && y2 < 140)),
      tap(val => {
        //console.log(val)
      }),
      throttleTime(200),
      tap(val => {
        //console.log(val);
      })
    ).subscribe(() => {
      // ici traitement final
      console.log("On va chercher de nouveaux assignments !")

      // on le fait en tache de fond...
      this.ngZone.run(() => {
        this.page = this.nextPage;
        this.getAssignmentsScrollInfini();
      })
    })
  }

  // appelé après le constructeur et AVANT l'affichage du composant
  ngOnInit(): void {
    console.log("Dans ngOnInit, appelé avant l'affichage");
    this.token = sessionStorage.getItem('token');
    this.getAssignments(this.token);
    this.getMatiere();
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

drop(event: CdkDragDrop<Assignment[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
  }
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

}
