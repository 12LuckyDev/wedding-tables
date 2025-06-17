import { Component, DestroyRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export const DIALOG_IMPORTS = [MatDialogModule, MatButtonModule];

@Component({ template: '' })
export abstract class DialogBaseComponent {
  protected readonly _destroyRef = inject(DestroyRef);
  protected readonly _dialogRef = inject(MatDialogRef<DialogBaseComponent>);

  protected close(result?: unknown): void {
    this._dialogRef.close(result);
  }

  public cancel(): void {
    this.close();
  }

  public accept(): void {
    this.close();
  }
}
