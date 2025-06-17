import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Guest } from '../../../../core/models';
import { guestsImport } from '../../../../core/helpers';
import { ImportSummaryDialogComponent } from './import-summary-dialog/import-summary-dialog.component';
import { GuestsListComponent } from './guests-list/guests-list.component';
import { WeddingStore } from '../../../../core/stores';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from '../../../../core/services/dialog.service';

@Component({
  selector: 'app-guests',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, GuestsListComponent],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss',
})
export class GuestsComponent {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _dialogService = inject(DialogService);
  private readonly _snackBar = inject(MatSnackBar);

  public readonly guests: Signal<Guest[]> = this._weddingStore.guests;

  public async onImportQuests(input: HTMLInputElement): Promise<void> {
    const file = input.files?.[0] ?? null;
    input.value = '';

    if (file) {
      const guestsToImport = await guestsImport(file, this.guests());
      if (guestsToImport.error) {
        this._snackBar.open(guestsToImport.error, undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000,
        });
        return;
      }

      this._dialogService.openMedium(ImportSummaryDialogComponent, { guestsToImport }, this._destroyRef).subscribe();
    }
  }

  public onAddQuests(): void {}
}
