import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "landing"},
  { path: "landing", pathMatch: "full", loadChildren: async () => (await import('./landing/landing.module')).LandingModule },
  { path: "login", pathMatch: "full", loadChildren: async () => (await import('./login/login.module')).LoginModule, },
  // { path: "dashboard", pathMatch: "full", component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }