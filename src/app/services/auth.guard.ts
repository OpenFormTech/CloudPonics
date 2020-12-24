import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> 
  {
    return this.auth.user$.pipe( // rxjs magic
      take(1), // take the first value emitted
      map(user => !!user), // change the value emitted
      tap(loggedIn => {
        /**
         * copy it and log the value for debug purposes, not required and has no effect on the *returned* value,
         * the effect this code has is it makes the router redirect to the home page.
         */
        if(!loggedIn) {
          console.log("unauth'd user tried to access");
          this.router.navigate(['/login'])
        }
      })
      // returns the mapped boolean user
    )
  }
  
}
