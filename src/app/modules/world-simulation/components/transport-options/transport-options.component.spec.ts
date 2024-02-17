import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportOptionsComponent } from './transport-options.component';

describe('TransportOptionsComponent', () => {
  let component: TransportOptionsComponent;
  let fixture: ComponentFixture<TransportOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransportOptionsComponent]
    });
    fixture = TestBed.createComponent(TransportOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
