import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculeCardDetailedComponent } from './vehicule-card-detailed.component';

describe('VehiculeCardDetailedComponent', () => {
  let component: VehiculeCardDetailedComponent;
  let fixture: ComponentFixture<VehiculeCardDetailedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehiculeCardDetailedComponent]
    });
    fixture = TestBed.createComponent(VehiculeCardDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
