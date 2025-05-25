import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Component, computed, inject, input, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Guest, Table, WeddingStore } from '../../wedding.store';
import { WeddingService } from '../../weddings.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [
    MatButtonModule,
    MatIconModule,
    CdkDrag,
    CdkDropList,
    CdkDragPlaceholder,
    AsyncPipe,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _weddingService = inject(WeddingService);

  public readonly tableNumber = input<number>();
  public readonly table: Signal<Table | null> = computed(
    () =>
      this._weddingStore
        .tables()
        .find((t) => t.number === this.tableNumber()) ?? null
  );
  public readonly chairs: Signal<Guest[][]> = computed(() =>
    (this.table()?.chairs ?? []).map((guest) => (guest ? [guest] : []))
  );

  public get dragHoverType$(): Observable<boolean> {
    return this._weddingService.dragHoverType$;
  }

  public onDeleteTable(): void {
    const tableNumber = this.tableNumber() ?? null;
    if (tableNumber !== null) {
      this._weddingStore.removeTable(tableNumber);
    }
  }

  public getTranform(index: number): string {
    return `transform: rotate(${
      index * (360 / this.chairs().length)
    }deg) translateX(440%);`;
  }

  public getReverseTranform(index: number): string {
    return `transform: rotate(-${index * (360 / this.chairs().length)}deg);`;
  }

  public dropPredicate(
    _drag: CdkDrag<{
      guest: Guest;
      tableNumber: number | null;
      chairIndex: number | null;
    }>,
    drop: CdkDropList
  ): boolean {
    return drop.data.length === 0;
  }

  public drop(
    {
      item,
    }: CdkDragDrop<
      Guest[],
      Guest[],
      { guest: Guest; tableNumber: number | null; chairIndex: number | null }
    >,
    chairIndex: number
  ): void {
    const tableNumber = this.tableNumber() ?? null;
    if (tableNumber === null) {
      return;
    }

    const {
      guest,
      tableNumber: previousTableNumber,
      chairIndex: previousChairIndex,
    } = item.data;

    if (previousTableNumber === null) {
      this._weddingStore.moveGuestFromList(guest, tableNumber, chairIndex);
    } else if (previousChairIndex !== null) {
      this._weddingStore.moveGuestBetweenTables(
        guest,
        tableNumber,
        previousTableNumber,
        chairIndex,
        previousChairIndex
      );
    }
  }

  public onListEntered(): void {
    this._weddingService.changeHoverType(true);
  }
}
