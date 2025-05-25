import { Component, inject, Signal } from '@angular/core';
import { Guest, WeddingStore } from '../wedding.store';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDragPreview,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-guests',
  imports: [CdkDropList, CdkDrag, CdkDragPreview, CdkDragPlaceholder],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss',
})
export class GuestsComponent {
  private readonly _weddingStore = inject(WeddingStore);

  public readonly guests: Signal<Guest[]> = this._weddingStore.guests;

  public drop(
    event: CdkDragDrop<
      Guest[],
      Guest[],
      { guest: Guest; tableNumber: number | null; chairIndex: number | null }
    >
  ): void {
    const { guest, tableNumber, chairIndex } = event.item.data;

    if (tableNumber !== null && chairIndex !== null) {
      this._weddingStore.removeGuestFromTable(
        guest,
        event.currentIndex,
        tableNumber,
        chairIndex
      );
    } else {
      this._weddingStore.moveGuestInList(
        event.previousIndex,
        event.currentIndex
      );
    }

    // if (event.previousContainer === event.container) {
    //   moveItemInArray(
    //     event.container.data,
    //     event.previousIndex,
    //     event.currentIndex
    //   );
    // } else {
    //   transferArrayItem(
    //     event.previousContainer.data,
    //     event.container.data,
    //     event.previousIndex,
    //     event.currentIndex
    //   );
    // }
  }
}
