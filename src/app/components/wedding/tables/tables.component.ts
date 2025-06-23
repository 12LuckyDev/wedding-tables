import { Component, computed, DestroyRef, inject, Signal } from '@angular/core';
import { TableComponent } from './table/table.component';
import { Table } from '../../../../core/models';
import { WeddingStore } from '../../../../core/stores';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';
import { DialogService, BacklogService } from '../../../../core/services';
import { TOOLBAR_IMPORTS } from '../../../../core/imports';

@Component({
  selector: 'app-tables',
  imports: [TOOLBAR_IMPORTS, TableComponent],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
})
export class TablesComponent {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dialogService = inject(DialogService);
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _backlogService = inject(BacklogService);

  public readonly tables: Signal<Table[]> = this._weddingStore.tables;
  public readonly count: Signal<number> = computed(() => this.tables().length);

  public onAddTable(): void {
    this._weddingStore.addTable();
  }

  public onExport(): void {
    this._dialogService.openBig(ExportDialogComponent, {}, this._destroyRef).subscribe();
  }

  public onExportBacklog(): void {
    this._backlogService.exportBacklog();
  }

  public onImportBacklog(): void {
    this._backlogService.importBacklog();
  }
}
