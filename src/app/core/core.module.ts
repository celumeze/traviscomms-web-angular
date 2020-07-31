import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [],
  providers: [
    AuthService,
    AuthGuardService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ]
})
export class CoreModule { }
