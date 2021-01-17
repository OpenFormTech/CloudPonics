import { NgModule } from '@angular/core';
import { WidgetspaceComponent } from './widgetspace.component';
import { ChartwidgetComponent } from './chartwidget/chartwidget.component';
import { WidgetdirectiveDirective } from './widgetdirective.directive';

@NgModule({
  declarations: [
    WidgetspaceComponent, 
    ChartwidgetComponent, 
    WidgetdirectiveDirective,
  ],
  imports: [],
  exports: [
    WidgetspaceComponent
  ]
})
export class WidgetspaceModule { }
