import { Component, inject, Signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Guest } from '../../../../core/models';
import { guestsImport } from '../../../../core/helpers';
import { MatDialog } from '@angular/material/dialog';
import { ImportSummaryDialogComponent } from './import-summary-dialog/import-summary-dialog.component';
import { GuestsListComponent } from './guests-list/guests-list.component';
import { WeddingStore } from '../../../../core/stores';

@Component({
  selector: 'app-guests',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, GuestsListComponent],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss',
})
export class GuestsComponent {
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _dialog = inject(MatDialog);

  public readonly guests: Signal<Guest[]> = this._weddingStore.guests;

  public async onImportQuests(input: HTMLInputElement): Promise<void> {
    const file = input.files?.[0] ?? null;
    input.value = '';

    if (file) {
      const guestsToImport = await guestsImport(file, this.guests());
      const dialogRef = this._dialog.open(ImportSummaryDialogComponent, {
        width: '1200px',
        data: { guestsToImport },
      });

      dialogRef.afterClosed().subscribe();
    }
  }

  public onAddQuests(): void {}
}
