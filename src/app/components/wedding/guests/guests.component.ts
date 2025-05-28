import { Component, inject, Signal } from '@angular/core';
import { WeddingStore } from '../wedding.store';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDragPreview, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { WeddingService } from '../weddings.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Guest } from '../../../../core/models';
import { readGuestFile } from '../../../../core/helpers';

@Component({
  selector: 'app-guests',
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
    event: CdkDragDrop<Guest[], Guest[], { guest: Guest; tableNumber: number | null; chairIndex: number | null }>,
  ): void {
    const { guest, tableNumber, chairIndex } = event.item.data;

    if (tableNumber !== null && chairIndex !== null) {
      this._weddingStore.removeGuestFromTable(guest, event.currentIndex, tableNumber, chairIndex);
    } else {
      this._weddingStore.moveGuestInList(event.previousIndex, event.currentIndex);
    }
  }

  public async onImportQuests(input: HTMLInputElement): Promise<void> {
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (file) {
      const guests = await readGuestFile(file);
      console.log(guests);
    }
  }

  public onAddQuests(): void {}

  public onListEntered(): void {
    this._weddingService.changeHoverType(false);
  }
}
