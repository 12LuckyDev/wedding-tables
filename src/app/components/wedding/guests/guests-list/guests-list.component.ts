import { Component, inject, Signal } from '@angular/core';
import { WeddingStore } from '../../wedding.store';
import { WeddingService } from '../../weddings.service';
import { Guest, GuestDragData } from '../../../../../core/models';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDragPreview, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-guests-list',
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragPreview,
    CdkDragPlaceholder,
    AsyncPipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './guests-list.component.html',
  styleUrl: './guests-list.component.scss',
})
export class GuestsListComponent {
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _weddingService = inject(WeddingService);

  public readonly guests: Signal<Guest[]> = this._weddingStore.guests;

  public get dragHoverType$(): Observable<boolean> {
    return this._weddingService.dragHoverType$;
  }

  public drop(event: CdkDragDrop<Guest[], Guest[] | (string | null), GuestDragData>): void {
    const { guest, tableNumber, chairIndex } = event.item.data;

    if (tableNumber !== null && chairIndex !== null) {
      this._weddingStore.removeGuestFromTable(guest, event.currentIndex, tableNumber, chairIndex);
    } else {
      this._weddingStore.moveGuestInList(event.previousIndex, event.currentIndex);
    }
  }

  public onListEntered(): void {
    this._weddingService.changeHoverType(false);
  }
}
