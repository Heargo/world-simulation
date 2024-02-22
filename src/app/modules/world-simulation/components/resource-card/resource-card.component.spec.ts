import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceCardComponent } from './resource-card.component';

describe('ResourceCardComponent', () => {
  let component: ResourceCardComponent;
  let fixture: ComponentFixture<ResourceCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceCardComponent]
    });
    fixture = TestBed.createComponent(ResourceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
