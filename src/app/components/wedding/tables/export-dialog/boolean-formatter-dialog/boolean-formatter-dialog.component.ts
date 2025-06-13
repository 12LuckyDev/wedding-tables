import { Component, computed, effect, inject, signal, Signal, WritableSignal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { WeddingMetadataStore } from '../../../../../../core/stores/wedding-metadata.store';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BooleanFormatter } from '../../../../../../core/models';

const ADD_ID = 'ADD';

@Component({
  selector: 'app-boolean-formatter-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './boolean-formatter-dialog.component.html',
  styleUrl: './boolean-formatter-dialog.component.scss',
})
export class BooleanFormatterDialogComponent {
  private readonly _dialogRef = inject(MatDialogRef<BooleanFormatterDialogComponent>);
  private readonly _data = inject<{ formatterId: string | null }>(MAT_DIALOG_DATA);

  private readonly _weddingMetadataStore = inject(WeddingMetadataStore);
  public readonly editedId: WritableSignal<string | null> = signal<string | null>(null);
  public readonly selectedId: WritableSignal<string | null> = signal<string | null>(this._data.formatterId);
  public readonly adding: WritableSignal<boolean> = signal<boolean>(false);
  public readonly tableFormatters = computed(() =>
    this.adding()
      ? [
          ...this._weddingMetadataStore.booleanFormatters(),
          { id: ADD_ID, editable: true, trueLabel: '', falseLabel: '' },
        ]
      : this._weddingMetadataStore.booleanFormatters(),
  );

  public readonly columns: string[] = ['true', 'false', 'options'];

  private _formGroup: FormGroup;

  constructor() {
    this._formGroup = new FormGroup({});
    effect(() => {
      const editedId = this.editedId();
      if (!editedId) {
        this._formGroup.removeControl('trueLabel');
        this._formGroup.removeControl('falseLabel');
        return;
      }
      const existing = this.tableFormatters().find(({ id }) => id === editedId);

      if (!existing) {
        return;
      }

      this._formGroup.addControl('trueLabel', new FormControl(existing.trueLabel, [Validators.required]));
      this._formGroup.addControl('falseLabel', new FormControl(existing.falseLabel, [Validators.required]));
    });
  }

  public get formGroup(): FormGroup {
    return this._formGroup;
  }

  public get isValid(): boolean {
    return this._formGroup.valid;
  }

  public getTrueControl(): FormControl | null {
    return this._formGroup.get('trueLabel') as FormControl | null;
  }

  public getFalseControl(): FormControl | null {
    return this._formGroup.get('falseLabel') as FormControl | null;
  }

  public add(): void {
    this.adding.set(true);
    this.editedId.set(ADD_ID);
  }

  public saveAdd(): void {
    const trueLabel = this.getTrueControl()?.value;
    const falseLabel = this.getFalseControl()?.value;
    if (trueLabel && falseLabel) {
      this.editedId.set(null);
      this.adding.set(false);
      this._weddingMetadataStore.addBooleanFormatter(trueLabel, falseLabel);
    }
  }

  public edit({ id }: BooleanFormatter): void {
    this.editedId.set(id);
  }

  public saveEdit(): void {
    const id = this.editedId();
    this.editedId.set(null);
    const trueLabel = this.getTrueControl()?.value;
    const falseLabel = this.getFalseControl()?.value;
    if (id && trueLabel && falseLabel) {
      this._weddingMetadataStore.editBooleanFormatter(id, trueLabel, falseLabel);
    }
  }

  public remove({ id }: BooleanFormatter): void {
    if (id === ADD_ID) {
      this.adding.set(false);
    }
    if (this.editedId() === id) {
      this.editedId.set(null);
    }
    if (this.selectedId() === id) {
      this.selectedId.set(null);
    }

    this._weddingMetadataStore.removeBooleanFormatter(id);
  }

  public accept(): void {
    this._dialogRef.close();
  }

  public cancel(): void {
    this._dialogRef.close();
  }
}
