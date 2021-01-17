import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WidgetspaceModule } from './widgetspace/widgetspace.module';

const routes: Routes = [
  { path: '', component: DashboardComponent },
];


@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    WidgetspaceModule,
    RouterModule.forChild(routes),
  ],
  exports: [DashboardComponent],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }