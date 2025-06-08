import { Component, inject, Signal } from '@angular/core';
import { Guest, GuestDragData } from '../../../../../core/models';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDragPreview, CdkDropList } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DragParentComponent } from '../../../../../core/abstractions/drag-parent.component';
import { GuestDragPlaceholderComponent } from '../../guest-drag-placeholder/guest-drag-placeholder.component';
import { GuestListItemComponent } from '../../guest-list-item/guest-list-item.component';
import { GuestChairItemComponent } from '../../guest-chair-item/guest-chair-item.component';
import { WeddingStore } from '../../../../../core/stores';

@Component({
  selector: 'app-guests-list',
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragPreview,
    CdkDragPlaceholder,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    GuestDragPlaceholderComponent,
    GuestListItemComponent,
    GuestChairItemComponent,
  ],
  templateUrl: './guests-list.component.html',
  styleUrl: './guests-list.component.scss',
})
export class GuestsListComponent extends DragParentComponent {
  private readonly _weddingStore = inject(WeddingStore);

  public readonly guests: Signal<Guest[]> = this._weddingStore.guests;

  public override get componentListPresentation(): boolean {
    return true;
  }

  public drop(event: CdkDragDrop<Guest[], Guest[] | (string | null), GuestDragData>): void {
    const { guest, tableNumber, chairIndex } = event.item.data;

    if (tableNumber !== null && chairIndex !== null) {
      this._weddingStore.removeGuestFromTable(guest, event.currentIndex, tableNumber, chairIndex);
    } else {
      this._weddingStore.moveGuestInList(event.previousIndex, event.currentIndex);
    }
  }
}
