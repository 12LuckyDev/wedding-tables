import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { WeddingMetadataStore } from '../../../../../../core/stores/wedding-metadata.store';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

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
  private readonly _data = inject<{}>(MAT_DIALOG_DATA);

  private readonly _weddingMetadataStore = inject(WeddingMetadataStore);

  private _formGroup: FormGroup;

  constructor() {
    this._formGroup = new FormGroup({});
  }

  public get formGroup(): FormGroup {
    return this._formGroup;
  }

  public get isValid(): boolean {
    return this._formGroup.valid;
  }

  public accept(): void {
    this._dialogRef.close();
  }

  public cancel(): void {
    this._dialogRef.close();
  }
}
