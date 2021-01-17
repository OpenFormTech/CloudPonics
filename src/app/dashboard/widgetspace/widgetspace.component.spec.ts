import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetspaceComponent } from './widgetspace.component';

describe('WidgetspaceComponent', () => {
  let component: WidgetspaceComponent;
  let fixture: ComponentFixture<WidgetspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetspaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
