import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';



@NgModule({
  declarations: [],
  imports: [],
  providers: [
    AuthService,
    AuthGuardService
  ]
})
export class CoreModule { }
