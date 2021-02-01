import { Component, OnInit, ComponentFactoryResolver, ViewChild, Injector } from '@angular/core';
import { WidgetdirectiveDirective } from './widgetdirective.directive';
import { ChartwidgetComponent } from './chartwidget/chartwidget.component';

export class ChartConfig {
  config : Object;
  project : string;
  run : string;
  label : string;
}

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

    // TODO: GET USER CHART PREF LIST<ChartConfig> FROM DATABASE 
    var chart1pref : ChartConfig = {
      "config" : {
              "type": "line",
              "data": {
                  "labels": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                  "datasets": [{
                      "label": "Cubic interpolation (monotone)",
                      "backgroundColor": "rgba(0, 0, 0, 0)",
                      "fill": false,
                      "cubicInterpolationMode": "monotone"
                  }]
              },
              "options": {
                  "responsive": true,
                  "title": {
                      "display": true,
                      "text": "Chart.js Line Chart"
                  },
                  "tooltips": {
                      "mode": "index"
                  },
                  "scales": {
                      "xAxes": [{
                          "display": true,
                          "scaleLabel": {
                              "display": true
                          }
                      }],
                      "yAxes": [{
                          "display": true,
                          "scaleLabel": {
                              "display": true,
                              "labelString": "Value"
                          },
                          "ticks": {
                              "suggestedMin": -10,
                              "suggestedMax": 200
                          }
                      }]
                  }
              }
          },
      "project" : "project-uuid",
      "run" : "run-uuid",
      "label" : "dataset-label"
    };
    var chartPrefs : ChartConfig[] = [
      chart1pref
    ];

    for(const chartPref of chartPrefs){
      // creating the component in the given view
      var widget = viewContainerRef.createComponent<ChartwidgetComponent>(widgetFactory).instance;

      // Pass config to Input
      widget.chartConfig = chartPref;
    }
  }
}
