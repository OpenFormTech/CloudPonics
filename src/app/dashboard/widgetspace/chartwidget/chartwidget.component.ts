import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Color, BaseChartDirective } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType, ChartPoint } from 'chart.js';
import 'firebase/firestore';
import * as moment from 'moment';

interface DataPoint {
  timestamp: firebase.default.firestore.Timestamp;
  value: number;
}

@Component({
  selector: 'app-chartwidget',
  templateUrl: './chartwidget.component.html',
  styleUrls: ['./chartwidget.component.css']
})
export class ChartwidgetComponent implements OnInit{

  // Input-Populated (User settings)
  @Input() collectionReference: firebase.default.firestore.DocumentReference;     // angular firestore db reference
  @Input() chartType: ChartType;              // chart type
  @Input() chartOptions : ChartOptions;       // chart options
  @Input() chartLegend = true;                // chart legend input
  @Input() chartColor : Color;                // chart color
  @Input() dataDelimiter : number;            // limiting the amount of data points to pull
  @Input() dataCollection: string;            // the name of the collection to pull data from

  // Database-Populated (from data)
  public chartData: ChartDataSets = {};

  // Internal
  // private dataref : AngularFirestoreCollection<DataPoint>;
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private auth: AuthService) { 
    this.auth = auth;
  }

  ngOnInit(): void {

    // CHART CONFIG
    // since all the data collection names are words separated by dashes, split on the dashes and capitalize each word
    this.chartData.label = this.dataCollection.split('-').map(word => word.replace(/^\w/, (c) => c.toUpperCase())).join(" ");
    this.chartData.data = [];

    // my god this looks so fucking nasty holy shit

    // GET USER
    this.auth.getUser().then(_ =>{
      // CREATE LISTENER w/ CUSTOM QUERY
      this.collectionReference.collection(this.dataCollection)
        .orderBy('timestamp')               // ordering the collection be sorted by timestamp
        .limitToLast(this.dataDelimiter)    // limiting N points
        .onSnapshot({                       // subscribing to datastream
          next: (data) => {
            // the net data collection
            data.forEach(v => {
              // pushing the new data to our chartdata array
              (this.chartData.data as ChartPoint[]).push(
                // values to ones which are readable by chart js
                {
                  x: moment.utc(v.data().timestamp.toMillis()).local(true),
                  y: v.data().value
                }
              );
              this.chart.update();
            })}
      });
    });
  }
}
