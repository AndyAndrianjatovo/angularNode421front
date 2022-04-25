import { Component, OnInit , Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-noter',
  templateUrl: './noter.component.html',
  styleUrls: ['./noter.component.css']
})
export class NoterComponent implements OnInit {

  devoir!: Assignment;

  note!: number;
  remarques!: string;

  constructor(
    public dialogRef: MatDialogRef<NoterComponent>,private assignmentsService: AssignmentsService, private router: Router,private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
    this.devoir = this.data.assign;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeModals(): void {
    this.dialogRef.close();
  }

  openSnackBarNoter() {
    this._snackBar.open('Devoir rendu', 'Fermer', {
      horizontalPosition: "end",
      verticalPosition: "bottom",
    });
  }

  openSnackBarSupprimer() {
    this._snackBar.open('Le devoir n\'est plus rendu', 'Fermer', {
      duration:3000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
    });
  }

  onSaveAssignment() {
    if (!this.devoir) return;

    this.devoir.rendu = !this.devoir.rendu;
    this.devoir.note = this.note;
    this.devoir.remarques = this.remarques;
    this.assignmentsService
      .updateAssignment(this.devoir)
      .subscribe((reponse) => {
        console.log(reponse.message);

        // navigation vers la home page
        this.router.navigate(['/home']);
      });
      this.closeModals();
      if(this.data.evenement){
        transferArrayItem(
          this.data.evenement.previousContainer.data,
          this.data.evenement.container.data,
          this.data.evenement.previousIndex,
          this.data.evenement.currentIndex,
        );
        this.openSnackBarNoter();
      }
      
  }

  NepasRendre(){
    if (!this.devoir) return;

    this.devoir.rendu = !this.devoir.rendu;
    this.devoir.note = 0;
    this.devoir.remarques = "";
    this.assignmentsService
      .updateAssignment(this.devoir)
      .subscribe((reponse) => {
        console.log(reponse.message);

        // navigation vers la home page
        this.router.navigate(['/home']);
      });
      this.closeModals();
      transferArrayItem(
        this.data.evenement.previousContainer.data,
        this.data.evenement.container.data,
        this.data.evenement.previousIndex,
        this.data.evenement.currentIndex,
      );
      this.openSnackBarSupprimer();
  }

}

export interface DialogData {
  assign: Assignment;
  evenement: CdkDragDrop<Assignment[]>
}

