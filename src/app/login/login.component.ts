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

  getUser(): void{
    this.auth.listenForUser(user => {
      this.user = user;
      if ( !!this.user ) {
        // if there is a user signed in, navigate to dashboard
        console.log("received auth'd user, switching page");
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
