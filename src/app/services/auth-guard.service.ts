import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router,
  ) { }

  canActivate(): boolean {
    if (!this.auth.isAutenticated()) {
      // console.log('authGuard Work!!!');
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  isAuthenticated(): boolean {
    if (!this.auth.isAutenticated()) {
      return false;
    }
    return true;
  }
}
