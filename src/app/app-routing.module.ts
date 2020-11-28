import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "landing"},
  { path: "landing", pathMatch: "full", loadChildren: async () => (await import('./landing/landing.module')).LandingModule },
  { path: "login", pathMatch: "full", loadChildren: async () => (await import('./login/login.module')).LoginModule, },
  { path: "dashboard", pathMatch: "full", loadChildren: async () => (await import('./dashboard/dashboard.module')).DashboardModule, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }