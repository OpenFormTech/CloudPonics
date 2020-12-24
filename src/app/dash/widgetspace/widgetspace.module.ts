import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { WidgetspaceComponent } from './widgetspace.component';

const routes: Routes = [
  {
    path: '',
    component: WidgetspaceComponent,
  },
];

@NgModule({
  declarations: [WidgetspaceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    WidgetspaceComponent
  ]
})
export class WidgetspaceModule { }
