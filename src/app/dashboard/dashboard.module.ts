import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AuthService
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }