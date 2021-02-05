import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth.service';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType, ChartPoint } from 'chart.js';
import 'firebase/firestore';
import * as moment from 'moment';
import { dbConfig } from '../widgetspace.interface';

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
  @Input() databaseConfig: dbConfig;          // angular firestore db reference
  @Input() chartType: ChartType;  // chart type
  @Input() chartOptions : ChartOptions;       // chart options
  @Input() chartLegend = true;                // chart legend input
  @Input() chartColor : Color;                // chart color
  @Input() dataDelimiter : number;       // limiting the amount of data points to pull

  // Database-Populated (from data)
  public chartData: ChartDataSets = {};

  // Internal
  private dataref : AngularFirestoreCollection<DataPoint>;
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private db : AngularFirestore, private auth: AuthService) { 
    this.db = db;
    this.auth = auth;
  }

  ngOnInit(): void {

    // GET USER
    this.auth.getUser().then(user=>{
      // CREATE LISTENER w/ CUSTOM QUERY
      this.dataref = this.db.collection<DataPoint>('projects/'+this.databaseConfig.project+'/runs/'+this.databaseConfig.run+'/'+this.databaseConfig.label, collection=>{
        return collection.orderBy('timestamp').limitToLast(this.dataDelimiter);
      });

      // CHART CONFIG
      this.chartData.label = this.databaseConfig.label;
      this.chartData.data = [];

      // BUILD QUERY-DATA SUBSCRIPTION
      this.dataref.snapshotChanges(['added']).subscribe(datapoints => {
        // takings all the data points and mapping them to usable chart data
        (this.chartData.data as ChartPoint[]) = datapoints.map(datapoint => {
          const data = datapoint.payload.doc.data();
          // console.log(data);

          return {
            x : moment.utc(data.timestamp.toMillis()).local(true),
            y : data.value
          };
        });

        // Refresh the chart
        this.chart.update();
      });
    });
  }
}
