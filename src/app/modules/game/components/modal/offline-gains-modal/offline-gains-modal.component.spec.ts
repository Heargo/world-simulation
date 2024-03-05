import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineGainsModalComponent } from './offline-gains-modal.component';

describe('OfflineGainsModalComponent', () => {
  let component: OfflineGainsModalComponent;
  let fixture: ComponentFixture<OfflineGainsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfflineGainsModalComponent]
    });
    fixture = TestBed.createComponent(OfflineGainsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
