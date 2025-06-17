import { Component, computed, DestroyRef, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TableComponent } from './table/table.component';
import { Table } from '../../../../core/models';
import { WeddingStore } from '../../../../core/stores';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';
import { DialogService } from '../../../../core/services/dialog.service';

@Component({
  selector: 'app-tables',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, TableComponent],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
})
export class TablesComponent {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dialogService = inject(DialogService);
  private readonly _weddingStore = inject(WeddingStore);

  public readonly tables: Signal<Table[]> = this._weddingStore.tables;
  public readonly count: Signal<number> = computed(() => this.tables().length);

  public onAddTable(): void {
    this._weddingStore.addTable();
  }

  public onExport(): void {
    this._dialogService.openMedium(ExportDialogComponent, {}, this._destroyRef).subscribe();
  }
}
