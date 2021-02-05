import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth.service';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
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
  @Input() databaseConfig;
  @Input() chartType: ChartType = 'scatter';
  @Input() chartOptions : ChartOptions;
  @Input() chartLegend = true;
  @Input() chartColor : Color;
  @Input() length : number = 10;

  // Database-Populated (from data)
  public chartData: ChartDataSets = {};
  public chartLabel: Label = 'Label';

  // Internal
  private dataref : AngularFirestoreCollection<DataPoint>;
  // private mintime : number = 0;
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
        return collection.orderBy('timestamp').limitToLast(this.length);
      });

      // CHART CONFIG
      this.chartData.label = this.databaseConfig.label;
      console.log(this.chartData.data);

      // BUILD QUERY-DATA SUBSCRIPTION
      this.dataref.snapshotChanges(['added']).subscribe(datapoints => {
        (this.chartData.data as ChartPoint[]) = datapoints.map(datapoint => {
          const data = datapoint.payload.doc.data();
          console.log(data);
          // this.mintime = Math.min(this.mintime, data.timestamp.toMillis());
          return {
            x : moment.utc(data.timestamp.toMillis()),
            y : data.value
          };
        });

        console.log(this.chartData.data);
        // Refresh the chart
        // this.chart.options.scales.xAxes[0].time.min = String(this.mintime);
        this.chart.update();
      });
    });
  }
}
