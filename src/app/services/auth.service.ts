// angular imports
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// firebase imports
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

// rxJS imports
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * what are observables?
 * https://rxjs-dev.firebaseapp.com/guide/observable
 * 
 * More or less an automated queue datastructure which pushes
 * data immediately to the requested source. It updates
 * dynamically.
 */

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User>;

  constructor(
    // required inputs to the constructor
    private afAuth: AngularFireAuth,
    private router: Router
  ) { 
    // defining our user from the authstate and returning it as an observable
    this.user$ = this.afAuth.authState.pipe(
      /**
       * using rxJS magic to return the observable of the user if the user
       * is logged in. user: firebase.User
       */
      switchMap(user => {
        if ( user ) {
          return of(user);
        } else {
          return of(null);
        }
      })
    )
  }

  // making a way to log users in
  async googleSignIn(){
    const provider = new firebase.auth.GoogleAuthProvider;
    const credential = await this.afAuth.signInWithPopup(provider);
    return credential.user;
  }

  // basic sign out function
  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }
}
