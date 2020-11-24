import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  user: firebase.User | null;

  constructor(public auth: AuthService, public router: Router) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void{
    this.auth.listenForUser(user => {
      this.user = user;
      // console.log(user);
      // if ( !!this.user ) {
      //   // if there is a user signed in, navigate to dashboard
      //   console.log("received auth'd user, switching page");
      //   this.router.navigate(['/dashboard']);
      // } else {
      //   // if there is no user signed in, navigate to login
      //   console.log("received null user, switching page");
      //   this.router.navigate(['/login']);
      // }
    });
  }

  activateLogic(): void {
    // console.log(this.user);

    if ( !!this.user ) {
      // if there is a user signed in, navigate to dashboard
      console.log("received auth'd user, switching page");
      this.router.navigate(['/dashboard']);
    } else {
      // if there is no user signed in, navigate to login
      console.log("received null user, switching page");
      this.router.navigate(['/login']);
    }
  }
}
