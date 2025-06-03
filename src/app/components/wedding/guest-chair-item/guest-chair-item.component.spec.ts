import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestChairItemComponent } from './guest-chair-item.component';

describe('GuestChairItemComponent', () => {
  let component: GuestChairItemComponent;
  let fixture: ComponentFixture<GuestChairItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestChairItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestChairItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
