import { Component, computed, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TableComponent } from './table/table.component';
import { WeddingStore } from '../wedding.store';
import { Table } from '../../../../core/models';

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

  public onAddTable(): void {
    this._weddingStore.addTable();
  }
}
