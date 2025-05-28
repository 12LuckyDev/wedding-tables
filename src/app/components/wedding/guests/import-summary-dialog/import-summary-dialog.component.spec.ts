import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSummaryDialogComponent } from './import-summary-dialog.component';

describe('ImportSummaryDialogComponent', () => {
  let component: ImportSummaryDialogComponent;
  let fixture: ComponentFixture<ImportSummaryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportSummaryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportSummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
