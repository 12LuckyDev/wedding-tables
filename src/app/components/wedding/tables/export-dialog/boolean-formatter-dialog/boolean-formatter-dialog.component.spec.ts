import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanFormatterDialogComponent } from './boolean-formatter-dialog.component';

describe('BooleanFormatterDialogComponent', () => {
  let component: BooleanFormatterDialogComponent;
  let fixture: ComponentFixture<BooleanFormatterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooleanFormatterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooleanFormatterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
