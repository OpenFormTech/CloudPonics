import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: firebase.User | null;

  constructor(public auth: AuthService, public router: Router) { }

  ngOnInit(): void {
    this.getUser();
  }

  async getUser() {
    this.auth.listenForUser(user => {
      this.user = user;
      /**
       * this payload is to redirect the user to the specified pages
       */

      if ( !!this.user ) {
        // if there is a user signed in, navigate to dashboard
        console.log("received an auth'd, switching page");
        this.router.navigate(['/dashboard']);
      } else {
        // if there is no user signed in, do nothing
        console.log("received null user, switching page");
      }
    });
  }

}
