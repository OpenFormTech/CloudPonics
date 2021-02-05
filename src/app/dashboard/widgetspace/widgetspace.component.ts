import { Component, OnInit, ComponentFactoryResolver, ViewChild, Injector } from '@angular/core';
import { WidgetdirectiveDirective } from './widgetdirective.directive';
import { ChartwidgetComponent } from './chartwidget/chartwidget.component';
import { ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts'

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

    // CHART LIFE CYCLE

    // What charts do we want?

    // Based on the current view, we would have projectid and runid OR deviceid

    // What kind of data is each chart getting/presenting?
    // Where can it get it?
    // What should the chart look like?

    // TODO: GET USER CHART PREF LIST<ChartOptions>, etc. FROM DATABASE 
    var chart1pref : ChartOptions = {
      "scales": {
          xAxes: [{
              "type": 'linear',
              // // "display": true,
              // // "scaleLabel": {
              // //     "display": true
              // // },
              "time": {
                "unit": 'hour',
                // "stepSize": 6
              },
          }],
      }
    };

    var chart1color : Color = { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    };

    var database1 = {
      "project" : "project-uuid",
      "run" : "run-uuid",
      "label" : "air-temperature"
    };
    var prefs = [
      {
        chartOptions : chart1pref,
        chartColor : chart1color,
        databaseConfig : database1
      }
    ];

    for(const pref of prefs){
      // creating the component in the given view
      var widget = viewContainerRef.createComponent<ChartwidgetComponent>(widgetFactory).instance;

      // Pass config to Input
      widget.chartOptions = pref.chartOptions;
      widget.databaseConfig = pref.databaseConfig;
      widget.chartColor = pref.chartColor;
    }
  }
}
