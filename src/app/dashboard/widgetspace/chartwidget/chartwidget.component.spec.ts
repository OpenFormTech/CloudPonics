import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartwidgetComponent } from './chartwidget.component';

describe('ChartwidgetComponent', () => {
  let component: ChartwidgetComponent;
  let fixture: ComponentFixture<ChartwidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartwidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartwidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
