import { Component, computed, inject, input, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WeddingStore } from '../../wedding.store';
import { Table, Guest } from '../../../../../core/models';
import { ChairComponent } from './chair/chair.component';
import { nMap } from '@12luckydev/utils';

@Component({
  selector: 'app-table',
  imports: [MatButtonModule, MatIconModule, ChairComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  private readonly _weddingStore = inject(WeddingStore);

  public readonly tableNumber = input<number>();
  public readonly table: Signal<Table | null> = this._weddingStore.getTable(this.tableNumber);

  public readonly transforms: Signal<string[]> = computed(() => {
    const amount = this.table()?.chairs?.length ?? 0;
    return nMap(
      amount,
      (i) =>
        `transform: rotate(${i * (360 / amount)}deg) translateX(var(--chair-translate)) rotate(-${i * (360 / amount)}deg);`,
    );
  });

  public guest: Guest[] = [];

  public onDeleteTable(): void {
    const tableNumber = this.tableNumber() ?? null;
    if (tableNumber !== null) {
      this._weddingStore.removeTable(tableNumber);
    }
  }
}
