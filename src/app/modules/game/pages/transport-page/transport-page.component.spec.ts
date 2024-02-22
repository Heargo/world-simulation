import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportPageComponent } from './transport-page.component';

describe('TransportPageComponent', () => {
  let component: TransportPageComponent;
  let fixture: ComponentFixture<TransportPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportPageComponent]
    });
    fixture = TestBed.createComponent(TransportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
