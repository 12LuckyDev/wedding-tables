import { Component, inject, input, Signal } from '@angular/core';
import { Guest } from '../../../../core/models';
import { WeddingDragStore } from '../wedding-drag.store';
import { GuestListItemComponent } from '../guest-list-item/guest-list-item.component';
import { GuestChairItemComponent } from '../guest-chair-item/guest-chair-item.component';

@Component({
  selector: 'app-guest-drag-placeholder',
  imports: [GuestListItemComponent, GuestChairItemComponent],
  templateUrl: './guest-drag-placeholder.component.html',
  styleUrl: './guest-drag-placeholder.component.scss',
})
export class GuestDragPlaceholderComponent {
  public readonly listPresentation: Signal<boolean> = inject(WeddingDragStore).listPresentation;

  public readonly guest = input<Guest>();
}
