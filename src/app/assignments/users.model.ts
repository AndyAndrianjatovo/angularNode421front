export class Users {
    _id?:string;
    nom!:string;
    password!:string;
    id!:Number;
    photo!:string;
    profil!:Number;
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
    id!:Number;
    __v!:Number;
  }
  