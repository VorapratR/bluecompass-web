import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { NewAccount, EmailPasswordPair } from '../models/user';

export type LoginProvider = 'google' | 'facebook' | 'twitter' | 'github';

export const createProvider = (provider: LoginProvider) => {
  switch (provider) {
    case 'google': return new firebase.auth.GoogleAuthProvider();
    case 'facebook': return new firebase.auth.FacebookAuthProvider();
    case 'twitter': return new firebase.auth.TwitterAuthProvider();
    case 'github': return new firebase.auth.GithubAuthProvider();
  }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
  ) { }

  async registerUser(user: NewAccount): Promise<firebase.User> {
    const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
    await result.user.updateProfile({
      displayName: user.name,
      photoURL: null,
    });
    const userUid = this.afAuth.auth.currentUser.uid;
    const db = firebase.firestore();
    db.collection('users').doc(userUid).set({
      displayName: this.afAuth.auth.currentUser.displayName,
      email: user.email,
      roles: ['guest']
    });
    return result.user;
  }

  loginUser(user: EmailPasswordPair) {
    return new Promise<firebase.User>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
        .then(
          res => resolve(res.user),
          err => reject(err));
    });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.auth.currentUser) {
        this.afAuth.auth.signOut()
          .then(() => {
            console.log('log out');
            resolve();
          }).catch((error) => {
            reject();
          });
      }
    });
  }

  isAutenticated() {
    if (this.afAuth.auth.currentUser) {
      return true;
    }
    return false;
  }

  userDetails() {
    return this.afAuth.auth.currentUser;
  }

  async logInWithProvider(provider: LoginProvider): Promise<firebase.User> {
    await this.afAuth.auth.signInWithRedirect(createProvider(provider));
    const result = await firebase.auth().getRedirectResult();
    return result.user;
  }
}
