import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: "",  pathMatch: "full", redirectTo: "/landing" },
  { path: "login", pathMatch: "full", component: LoginComponent },
  { path: "landing", pathMatch: "full", component: LandingComponent },
  { path: "dashboard", pathMatch: "full", component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
