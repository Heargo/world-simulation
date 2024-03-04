import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveModalComponent } from './save-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SaveModalComponent', () => {
  let component: SaveModalComponent;
  let fixture: ComponentFixture<SaveModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(SaveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
