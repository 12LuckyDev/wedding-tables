import { Component, inject, input, Signal } from '@angular/core';
import { Guest } from '../../../../core/models';
import { WeddingDragStore } from '../wedding-drag.store';

@Component({
  selector: 'app-guest-drag-placeholder',
  imports: [],
  templateUrl: './guest-drag-placeholder.component.html',
  styleUrl: './guest-drag-placeholder.component.scss',
})
export class GuestDragPlaceholderComponent {
  public readonly listPresentation: Signal<boolean> = inject(WeddingDragStore).listPresentation;

  public readonly guest = input<Guest>();
}
