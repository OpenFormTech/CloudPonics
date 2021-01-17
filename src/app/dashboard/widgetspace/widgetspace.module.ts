import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
import { WidgetspaceComponent } from './widgetspace.component';

// Leaving the path empty will overwrite dashboardComponent with WidgetspaceComponent
// const routes: Routes = [
//   {
//     path: '',
//     component: WidgetspaceComponent,
//   },
// ];

@NgModule({
  declarations: [WidgetspaceComponent],
  imports: [
    // Leaving the path empty will overwrite dashboardComponent with WidgetspaceComponent
    // RouterModule.forChild(routes),
  ],
  exports: [
    WidgetspaceComponent
  ]
})
export class WidgetspaceModule { }
