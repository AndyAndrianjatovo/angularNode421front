import { Component, OnInit , Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, transferArrayItem} from '@angular/cdk/drag-drop';

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
    public dialogRef: MatDialogRef<NoterComponent>,private assignmentsService: AssignmentsService, private router: Router,
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
      transferArrayItem(
        this.data.evenement.previousContainer.data,
        this.data.evenement.container.data,
        this.data.evenement.previousIndex,
        this.data.evenement.currentIndex,
      );
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
  }

}

export interface DialogData {
  assign: Assignment;
  evenement: CdkDragDrop<Assignment[]>
}

