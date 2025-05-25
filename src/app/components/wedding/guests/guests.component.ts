import { Component, inject, Signal } from '@angular/core';
import { Guest, WeddingStore } from '../wedding.store';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDragPreview,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';
import { WeddingService } from '../weddings.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-guests',
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragPreview,
    CdkDragPlaceholder,
    AsyncPipe,
  ],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss',
})
export class GuestsComponent {
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _weddingService = inject(WeddingService);

  public readonly guests: Signal<Guest[]> = this._weddingStore.guests;

  public get dragHoverType$(): Observable<boolean> {
    return this._weddingService.dragHoverType$;
  }

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
  }

  public onListEntered(): void {
    this._weddingService.changeHoverType(false);
  }
}
