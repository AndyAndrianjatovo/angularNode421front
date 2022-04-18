export class Users {
    _id?:string;
    nom!:string;
    password!:string;
  }
  
export class UsersToken {
  auth !: boolean;
  token!:string;
}

export class UsersWithoutPassword {
  _id?:string;
  nom!:string;
  photo!:string;
  profil!:Number;
  __v!:Number;
}