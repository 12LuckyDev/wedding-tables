import { Component, inject, input, Signal } from '@angular/core';
import { Guest, GuestDragData } from '../../../../../../core/models';
import { WeddingStore } from '../../../wedding.store';
import { WeddingService } from '../../../weddings.service';
import { MatButtonModule } from '@angular/material/button';
import { CdkDrag, CdkDropList, CdkDragPlaceholder, CdkDragDrop } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chair',
  imports: [MatButtonModule, MatIconModule, CdkDrag, CdkDropList, CdkDragPlaceholder, AsyncPipe],
  templateUrl: './chair.component.html',
  styleUrl: './chair.component.scss',
})
export class ChairComponent {
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _weddingService = inject(WeddingService);

  public readonly tableNumber = input<number>();
  public readonly chairIndex = input<number>();
  public readonly guestId = input<string | null>(null);
  public readonly guest: Signal<Guest | null> = this._weddingStore.getGuest(this.guestId);

  public get dragHoverType$(): Observable<boolean> {
    return this._weddingService.dragHoverType$;
  }

  public dropPredicate(_drag: unknown, drop: CdkDropList): boolean {
    return drop.data === null;
  }

  public drop({ item }: CdkDragDrop<string | null, Guest[] | string, GuestDragData>): void {
    const tableNumber = this.tableNumber() ?? null;
    const chairIndex = this.chairIndex() ?? null;
    if (tableNumber === null || chairIndex === null) {
      return;
    }

    const { guest, tableNumber: previousTableNumber, chairIndex: previousChairIndex } = item.data;

    if (previousTableNumber === null) {
      this._weddingStore.moveGuestFromList(guest, tableNumber, chairIndex);
    } else if (previousChairIndex !== null) {
      this._weddingStore.moveGuestBetweenTables(
        guest,
        tableNumber,
        previousTableNumber,
        chairIndex,
        previousChairIndex,
      );
    }
  }

  public onListEntered(): void {
    this._weddingService.changeHoverType(true);
  }
}
