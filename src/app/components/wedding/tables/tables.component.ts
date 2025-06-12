import { Component, computed, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TableComponent } from './table/table.component';
import { Table } from '../../../../core/models';
import { WeddingStore } from '../../../../core/stores';
import { MatDialog } from '@angular/material/dialog';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';

@Component({
  selector: 'app-tables',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, TableComponent],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
})
export class TablesComponent {
  private readonly _weddingStore = inject(WeddingStore);

  public readonly tables: Signal<Table[]> = this._weddingStore.tables;
  public readonly count: Signal<number> = computed(() => this.tables().length);

  private readonly _dialog = inject(MatDialog);

  public onAddTable(): void {
    this._weddingStore.addTable();
  }

  public onExport(): void {
    const dialogRef = this._dialog.open(ExportDialogComponent, {
      minWidth: 0,
      maxWidth: '100%',
      width: '60vw',
      autoFocus: '#accept',
    });

    dialogRef.afterClosed().subscribe();
  }
}
