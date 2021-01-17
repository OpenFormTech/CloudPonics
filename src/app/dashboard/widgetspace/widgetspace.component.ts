import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { WidgetdirectiveDirective } from './widgetdirective.directive';
import { ChartwidgetComponent } from './chartwidget/chartwidget.component';

@Component({
  selector: 'app-widgetspace',
  templateUrl: './widgetspace.component.html',
  styleUrls: ['./widgetspace.component.css']
})
export class WidgetspaceComponent implements OnInit {

  // getting the view to the anchor specified by the directive
  @ViewChild(WidgetdirectiveDirective, {static: true}) widgetHost: WidgetdirectiveDirective;

  // creating a ComponentFactoryResolver to generate a componentFactory within the code
  constructor(private widgetFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    // configuring the component factory
    const widgetFactory = this.widgetFactoryResolver.resolveComponentFactory(ChartwidgetComponent);

    // clearing the container in which the dynamically loaded component will reside in
    const viewContainerRef = this.widgetHost.viewContainerRef;
    viewContainerRef.clear();

    // creating the component in the given view
    viewContainerRef.createComponent<ChartwidgetComponent>(widgetFactory);
  }
}
