import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculeCardComponent } from './vehicule-card.component';

describe('VehiculeCardComponent', () => {
  let component: VehiculeCardComponent;
  let fixture: ComponentFixture<VehiculeCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehiculeCardComponent]
    });
    fixture = TestBed.createComponent(VehiculeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
