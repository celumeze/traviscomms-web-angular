import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninRedirectCallbackComponent } from './home-page/signin-redirect-callback.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { HomePageComponent } from './home-page/home-page.component';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'signin-callback', component: SigninRedirectCallbackComponent },
  { path: 'main-dashboard', component: MainDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
