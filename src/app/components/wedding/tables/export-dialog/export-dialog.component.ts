import { Component, computed, inject, Signal } from '@angular/core';
import { WeddingStore } from '../../../../../core/stores';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Table } from '../../../../../core/models';

@Component({
  selector: 'app-export-dialog',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatSlideToggleModule, MatCardModule, MatListModule],
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.scss',
})
export class ExportDialogComponent {
  private readonly _dialogRef = inject(MatDialogRef<ExportDialogComponent>);
  private readonly _weddingStore = inject(WeddingStore);

  public readonly allGuestCount: Signal<number> = this._weddingStore.allGuestCount;
  public readonly seatedCount: Signal<number> = computed(() => this._weddingStore.guests().length);
  public readonly tables: Signal<Table[]> = this._weddingStore.tables;

  private _exportForm: FormGroup;

  constructor() {
    this._exportForm = new FormGroup({
      anonymize: new FormControl(false),
      showMetadata: new FormControl(true),
    });

    const metadata = this._weddingStore.collectMedatada();
    console.log(metadata);
  }

  public get exportForm(): FormGroup {
    return this._exportForm;
  }

  public get isValid(): boolean {
    return this._exportForm.valid;
  }

  public accept(): void {
    this._dialogRef.close();
  }

  public cancel(): void {
    this._dialogRef.close();
  }
}
