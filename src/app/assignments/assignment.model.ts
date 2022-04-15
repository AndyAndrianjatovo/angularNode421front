export class Assignment {
  _id?:string;
  id!:number;
  nom!:string;
  dateDeRendu!:Date;
  rendu!:boolean;
  note!:number;
  remarques!:string;
  idMatiere!:number;
  idEleve!:number;
}
