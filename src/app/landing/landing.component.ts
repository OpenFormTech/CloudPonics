import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  providers: [NgbCarouselConfig]
})
export class LandingComponent implements OnInit {
  user: firebase.User | null; // making a variable for the user
  
  constructor(config: NgbCarouselConfig, public auth: AuthService, public router: Router) {
    // customize default values of carousels used by this component tree
    config.interval = 3000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;
    config.pauseOnFocus = false;
    config.showNavigationArrows = true;
  }
  
  ngOnInit(): void {
    this.getUser();
  }
  
  images = [
    {src: '../../assets/images/carousel3.jpg', desc: 'Scientific accuracy.', link:"#"},
    {src: '../../assets/images/carousel1.png', desc: 'Fleet deployability.', link:"#"},
    {src: '../../assets/images/carousel2.jpg', desc: 'Research applicability.', link:"#"}, 
  ];

  async getUser() {
    this.auth.listenForUser(user => {
      this.user = user;
    });
  }

  /**
   * this is the payload functionized and factored out of async getUser(),
   * so that a user can hit the login button and be transported to the right page.
   */
  testUserState() {
    /**
     * this payload is to redirect the user to the specified pages
     */

    if ( !!this.user ) {
      // if there is a user signed in, navigate to dashboard
      console.log("received null user, switching page");
      this.router.navigate(['/dashboard']);
    } else {
      // if there is no user signed in, navigate to login
      console.log("received null user, switching page");
      this.router.navigate(['/login']);
    }
  }
  
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;
  
}
