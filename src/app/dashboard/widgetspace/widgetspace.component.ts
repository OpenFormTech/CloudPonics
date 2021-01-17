import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-widgetspace',
  templateUrl: './widgetspace.component.html',
  styleUrls: ['./widgetspace.component.css']
})
export class WidgetspaceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log("widgetspace initialized");
  }

}
