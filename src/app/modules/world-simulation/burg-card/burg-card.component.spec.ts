import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurgCardComponent } from './burg-card.component';

describe('BurgCardComponent', () => {
  let component: BurgCardComponent;
  let fixture: ComponentFixture<BurgCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BurgCardComponent]
    });
    fixture = TestBed.createComponent(BurgCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
