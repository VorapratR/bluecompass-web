import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: Observable<User[]>;
  private userCollection: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.userCollection = this.db.collection<User>('users');
    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id , ...data };
        });
      })
    );
  }


  getAll(): Observable<User[]> {
    return this.users;
  }

  getById(id: string) {
    return this.userCollection.doc<User>(id).valueChanges().pipe(
      take(1),
      map(user => {
        user.uid = id;
        console.log(user.uid);
        return user;
      })
    );
  }

  // updateUser(user: User): Promise<void> {
  //   return this.userCollection.doc(user.id).update({
  //     displayName: user.name,
  //     email: user.email,
  //   })
  // }

  updateRole(user: User): Promise<void> {
    return this.userCollection.doc(user.uid).update({
      roles: user.roles
    });
  }

}
