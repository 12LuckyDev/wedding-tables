import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WeddingMetadataStore } from '../../../../../../core/stores/wedding-metadata.store';
import { FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BooleanFormatter } from '../../../../../../core/models';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DIALOG_IMPORTS, DialogFormBaseComponent, FORM_DIALOG_IMPORTS } from '../../../../../../core/abstractions';
import { MatTooltipModule } from '@angular/material/tooltip';

const ADD_ID = 'ADD';

@Component({
  selector: 'app-boolean-formatter-dialog',
  imports: [
    DIALOG_IMPORTS,
    FORM_DIALOG_IMPORTS,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './boolean-formatter-dialog.component.html',
  styleUrl: './boolean-formatter-dialog.component.scss',
})
export class BooleanFormatterDialogComponent extends DialogFormBaseComponent {
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

  public readonly columns: string[] = ['select', 'true', 'false', 'options'];

  constructor() {
    super();

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

  public override get isValid(): boolean {
    return super.isValid && this.selectedId() !== null;
  }

  public getTrueControl(): FormControl | null {
    return this._formGroup.get('trueLabel') as FormControl | null;
  }

  public getFalseControl(): FormControl | null {
    return this._formGroup.get('falseLabel') as FormControl | null;
  }

  public select(id: string): void {
    if (id === this.selectedId()) {
      this.selectedId.set(null);
    } else {
      this.selectedId.set(id);
    }
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
      const newId = this._weddingMetadataStore.addBooleanFormatter(trueLabel, falseLabel);
      this.selectedId.set(newId);
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

  public override accept(): void {
    this.close(this.selectedId());
  }
}
