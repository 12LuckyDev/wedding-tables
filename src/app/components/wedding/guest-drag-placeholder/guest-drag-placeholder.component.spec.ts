import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDragPlaceholderComponent } from './guest-drag-placeholder.component';

describe('GuestDragPlaceholderComponent', () => {
  let component: GuestDragPlaceholderComponent;
  let fixture: ComponentFixture<GuestDragPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestDragPlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestDragPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
