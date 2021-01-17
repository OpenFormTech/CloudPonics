import { NgModule } from '@angular/core';
import { WidgetspaceComponent } from './widgetspace.component';
import { ChartwidgetComponent } from './chartwidget/chartwidget.component';

@NgModule({
  declarations: [
    WidgetspaceComponent, 
    ChartwidgetComponent
  ],
  imports: [],
  exports: [
    WidgetspaceComponent
  ]
})
export class WidgetspaceModule { }
