// angular imports
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// firebase imports
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

// rxJS imports
import { Observable, of, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

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
  // configuring the observable for typescript
  user$: Observable<firebase.User | null>;

  constructor(
    // required inputs to the constructor
    private afAuth: AngularFireAuth,
    private router: Router

  ) { 
    /**
     * using storing the user as an observable which essentially turns it into a datastream,
     * which can be listened to from different parts of code.
    */
    this.user$ = this.afAuth.authState.pipe(
      /**
       * using rxJS magic to return the observable of the user if the user
       * is logged in. user: firebase.User
       */
      switchMap(user => {
        if ( user ) {
          // console.log("there is a auth'd user");
          return of(user);
        } else {
          // console.log("there is a null user");
          return of(null);
        }
      })
    )
  }

  // creating the google sigin in option
  async googleSignIn(){
    const provider = new firebase.auth.GoogleAuthProvider;
    const credential = await this.afAuth.signInWithPopup(provider);
    return credential.user;
  }

  // creating the github sigin in option
  async githubSignIn(){
    const provider = new firebase.auth.GithubAuthProvider;
    const credential = await this.afAuth.signInWithPopup(provider);
    return credential.user;
  }

  // creating the github sigin in option
  async emailSignIn(){
    const provider = new firebase.auth.EmailAuthProvider;
    const credential = await this.afAuth.signInWithPopup(provider);
    return credential.user;
  }

  // basic sign out function
  async signOut() {
    await this.afAuth.signOut();
    // console.log("signed out of account");
    return this.router.navigate(['/']);
  }

  listenForUser(tapFunc: (result: firebase.User | null) => void): Subscription{
    const l = this.user$.pipe(
      tap(async u => tapFunc(u))
    ).subscribe(
      // leaving open for future possible changes
    )

    return l;
  }
}
