import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestListItemComponent } from './guest-list-item.component';

describe('GuestListItemComponent', () => {
  let component: GuestListItemComponent;
  let fixture: ComponentFixture<GuestListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
