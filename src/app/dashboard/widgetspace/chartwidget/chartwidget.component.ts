import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/database';
import { AuthService } from '../../../services/auth.service';
import { ChartConfig } from '../widgetspace.component'
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';

class DataPoint {
  timestamp: Number;
  value: Number;
}

@Component({
  selector: 'app-chartwidget',
  templateUrl: './chartwidget.component.html',
  styleUrls: ['./chartwidget.component.css']
})
export class ChartwidgetComponent implements OnInit{

  public dataLength : number = 10;

  public lineChartData: ChartDataSets[] = [{ }];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  dataref : AngularFireList<DataPoint>;

  @Input() chartConfig : ChartConfig;

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private db : AngularFireDatabase, private auth: AuthService) { 
    this.db = db;
    this.auth = auth;
  }

  ngOnInit(): void {
    // GET USER
    this.auth.getUser().then(user=>{
      // CREATE LISTENER
      this.dataref = this.db.list<DataPoint>('projects/'+this.chartConfig.project+'/runs/'+this.chartConfig.run+'/data/'+this.chartConfig.label);

      // ON DATAPOINT ADDED
      this.dataref.snapshotChanges(['child_added']).subscribe(actions => {
        // REBUILD CHART DATA FROM LIST OF LATEST
        this.lineChartData = [{
          data : actions.slice(Math.max(actions.length - this.dataLength, 1)).map(action=>{
            const val = action.payload.val();
            return {
              x: Number(val.timestamp), 
              y: Number(val.value)
            };
          }), label : this.chartConfig.label
        }];
      });
    });

    // Refresh the chart
    this.chart.update();
  }
}
