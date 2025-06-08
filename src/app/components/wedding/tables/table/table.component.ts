import { Component, computed, inject, input, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Table, Guest, Color } from '../../../../../core/models';
import { ChairComponent } from './chair/chair.component';
import { nMap } from '@12luckydev/utils';
import { WeddingDragStore } from '../../../../../core/stores/wedding-drag.store';
import { WeddingStore } from '../../../../../core/stores';

@Component({
  selector: 'app-table',
  imports: [MatButtonModule, MatIconModule, ChairComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _weddingDragStore = inject(WeddingDragStore);

  public readonly tableNumber = input<number>();
  public readonly table: Signal<Table | null> = this._weddingStore.getTable(this.tableNumber);
  public readonly tableColor: Signal<Color> = this._weddingDragStore.getTableColor(this.tableNumber);

  public readonly transforms: Signal<string[]> = computed(() => {
    const amount = this.table()?.chairs?.length ?? 0;
    return nMap(
      amount,
      (i) =>
        `transform: rotate(${i * (360 / amount)}deg) translateX(var(--chair-translate)) rotate(-${i * (360 / amount)}deg);`,
    );
  });

  public guest: Guest[] = [];

  public onAddChair(): void {
    this._weddingStore.addChair(this.tableNumber);
  }

  public odRemoveChair(): void {
    this._weddingStore.removeChair(this.tableNumber);
  }

  public onDeleteTable(): void {
    this._weddingStore.removeTable(this.tableNumber);
  }
}
