import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { Guest } from '../../../../core/models';
import { guestsImport } from '../../../../core/helpers';
import { ImportSummaryDialogComponent } from './import-summary-dialog/import-summary-dialog.component';
import { GuestsListComponent } from './guests-list/guests-list.component';
import { WeddingStore } from '../../../../core/stores';
import { DialogService, ToastService } from '../../../../core/services';
import selectFiles from 'select-files';
import { TOOLBAR_IMPORTS } from '../../../../core/imports';

@Component({
  selector: 'app-guests',
  imports: [TOOLBAR_IMPORTS, GuestsListComponent],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss',
})
export class GuestsComponent {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _dialogService = inject(DialogService);
  private readonly _toastService = inject(ToastService);

  public readonly guests: Signal<Guest[]> = this._weddingStore.guests;

  public async onImportQuests(replace: boolean): Promise<void> {
    const files: FileList | null = await selectFiles();
    const file: File | null = files?.[0] ?? null;

    if (file) {
      const guestsToImport = await guestsImport(file, this._weddingStore.getAllGuest(), replace);
      if (guestsToImport.error) {
        this._toastService.open(guestsToImport.error);
        return;
      }

      this._dialogService.openBig(ImportSummaryDialogComponent, { guestsToImport }, this._destroyRef).subscribe();
    }
  }

  public onAddQuests(): void {}
}
