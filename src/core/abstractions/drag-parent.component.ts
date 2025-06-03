import { Component, inject } from '@angular/core';
import { WeddingDragStore } from '../../app/components/wedding/wedding-drag.store';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { GuestDragData } from '../models';

@Component({ template: '' })
export abstract class DragParentComponent {
  private readonly _weddingDragStore = inject(WeddingDragStore);

  protected abstract get componentListPresentation(): boolean;

  public dragStart(event: CdkDragStart<GuestDragData>): void {
    this._weddingDragStore.dragStart(event);
  }

  public dragReleased(): void {
    this._weddingDragStore.dragReleased();
  }

  public dropListEntered(): void {
    this._weddingDragStore.dropListEntered(this.componentListPresentation);
  }
}
