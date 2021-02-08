import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { WidgetdirectiveDirective } from './widgetdirective.directive';
import { ChartwidgetComponent } from './chartwidget/chartwidget.component';
// import { ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { FirestoreChartPreferences, RawFirestoreChartPreferences } from './widgetspace.interface';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-widgetspace',
  templateUrl: './widgetspace.component.html',
  styleUrls: ['./widgetspace.component.css']
})
export class WidgetspaceComponent implements OnInit {

  // getting the view to the anchor specified by the directive
  @ViewChild(WidgetdirectiveDirective, {static: true}) widgetHost: WidgetdirectiveDirective;

  // creating a ComponentFactoryResolver to generate a componentFactory within the code
  constructor(private widgetFactoryResolver: ComponentFactoryResolver, private auth: AuthService, private db: AngularFirestore) { }

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

    /**
     * This function manipulates the data given to it by the subcription and
     * fixes the axis to be legible.
     */
    function resolveChartOptions(data: FirestoreChartPreferences): FirestoreChartPreferences {
      let o: FirestoreChartPreferences = data;

      o.chartOptions = {
        scales: {
          xAxes: data.chartOptions.scales.xAxes,
          yAxes: [{
            type: 'linear',
            scaleLabel: {
              display: true,
              labelString: `${data.chartOptions.scales.yAxes[0].scaleLabel['axis-name']} (${data.chartOptions.scales.yAxes[0].scaleLabel['axis-units']})`
            }
          }]
        }
      };

      return o;
    }

    // the great thing about this is that I can make a map object for this
    // because everything is a string object
    var grayChartColor : Color = { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    };

    // getting the user chart prefs

    this.auth.getUser().then(user => {

      /**
       * Basically:
       * 
       * For each chart preference pulled by our subcription:
       *  1. Fix the ChartOptions
       *  2. Build the UserPrefence object, basically a container to hold everything
       *  3. Build a new ChartWidget
       *  4. Pass in all necessary params into it
       */

      // making a request to firestore to get the dashboard preferences document
      let dataref = this.db.doc<RawFirestoreChartPreferences>('users/' + user.uid + '/preferences/dashboard');
      // iterating over each field it got
      dataref.get().forEach(c => {
        // mapping to complete each chart's y-axis label
        c.data().charts.forEach(rawChartOptions => {
          let resolvedChartPrefs = resolveChartOptions(rawChartOptions)

          var widget = viewContainerRef.createComponent<ChartwidgetComponent>(widgetFactory).instance;

          // Pass config to Input
          widget.chartOptions        = resolvedChartPrefs.chartOptions;   // is what it sounds like
          widget.dataCollection      = resolvedChartPrefs.dataCollection; // air-temperature
          widget.chartColor          = grayChartColor;                    // chart color
          widget.dataDelimiter       = resolvedChartPrefs.delimiter;      // number of datapoints to get
          widget.chartType           = resolvedChartPrefs.chartType;      // scatter
          widget.collectionReference = resolvedChartPrefs.dataRef;        // reference to collection
        });
      });
    });
  }
}
