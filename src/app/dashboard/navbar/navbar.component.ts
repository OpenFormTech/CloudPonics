import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
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
        // console.log("received an auth'd user");
      } else {
        // if there is no user signed in, navigate to login
        // console.log("received null user, switching page");
        this.router.navigate(['/login']);
      }
    });
  }
}
