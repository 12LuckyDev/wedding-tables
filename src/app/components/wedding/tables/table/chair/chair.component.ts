import { Component, inject, input, Signal } from '@angular/core';
import { Guest, GuestDragData } from '../../../../../../core/models';
import { MatButtonModule } from '@angular/material/button';
import { CdkDrag, CdkDropList, CdkDragPlaceholder, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { DragParentComponent } from '../../../../../../core/abstractions/drag-parent.component';
import { GuestDragPlaceholderComponent } from '../../../guest-drag-placeholder/guest-drag-placeholder.component';
import { GuestChairItemComponent } from '../../../guest-chair-item/guest-chair-item.component';
import { WeddingStore } from '../../../../../../core/stores';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-chair',
  imports: [
    MatButtonModule,
    MatIconModule,
    CdkDrag,
    CdkDropList,
    CdkDragPlaceholder,
    GuestDragPlaceholderComponent,
    GuestChairItemComponent,
    MatTooltipModule,
  ],
  templateUrl: './chair.component.html',
  styleUrl: './chair.component.scss',
})
export class ChairComponent extends DragParentComponent {
  private readonly _weddingStore = inject(WeddingStore);

  public readonly tableNumber = input<number>();
  public readonly chairIndex = input<number>();
  public readonly guestId = input<string | null>(null);
  public readonly guest: Signal<Guest | null> = this._weddingStore.getGuest(this.guestId);

  public override get componentListPresentation(): boolean {
    return false;
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
}
