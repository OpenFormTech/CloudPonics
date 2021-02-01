import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

@Component({
  selector: 'app-chartwidget',
  templateUrl: './chartwidget.component.html',
  styleUrls: ['./chartwidget.component.css']
})
export class ChartwidgetComponent implements OnInit {

  canvasid: string;
  chart: Chart;
  ctx: HTMLElement;

  constructor() { 
    this.canvasid = Math.random().toString(20).substr(2, 10);
  }

  async makeChart(): Promise<void> {
    await new Promise(r => setTimeout(r, 200));
    this.ctx = document.getElementById(this.canvasid);
    console.log(this.ctx);
    this.chart = new Chart(this.ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
  }

  ngOnInit(): void {
    this.makeChart();
  }

}
