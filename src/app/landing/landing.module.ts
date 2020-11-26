import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Routes, RouterModule, Router } from '@angular/router';

import { LandingComponent } from './landing.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
];

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    NgbCarouselModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    LandingComponent
  ]
})
export class LandingModule { }
