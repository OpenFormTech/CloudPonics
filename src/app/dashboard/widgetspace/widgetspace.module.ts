import { NgModule } from '@angular/core';
import { WidgetspaceComponent } from './widgetspace.component';
import { ChartwidgetComponent } from './chartwidget/chartwidget.component';
import { WidgetdirectiveDirective } from './widgetdirective.directive';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    WidgetspaceComponent, 
    ChartwidgetComponent, 
    WidgetdirectiveDirective,
  ],
  imports: [
    ChartsModule
  ],
  exports: [
    WidgetspaceComponent
  ]
})
export class WidgetspaceModule { }
