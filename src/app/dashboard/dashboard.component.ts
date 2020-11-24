import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: firebase.User | null;

  constructor(public auth: AuthService, public router: Router) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void{
    this.auth.listenForUser(user => {
      this.user = user;
      if ( this.user == null ) {
        // if there is no user signed in, navigate to login
        console.log("received null user, switching page");
        this.router.navigate(['/login']);
      }
    });
  }
}
