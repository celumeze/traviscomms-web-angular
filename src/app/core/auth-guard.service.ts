import { Injectable, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CoreModule } from './core.module';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public router: Router,
              private authService: AuthService) { }


  canActivate(): Promise<boolean> {
   return this.authService.isLoggedIn().then(loggedIn => {
      if (!loggedIn) {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    });
  }
}
