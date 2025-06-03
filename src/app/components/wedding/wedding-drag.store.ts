import { computed, inject, Signal } from '@angular/core';
import { signalStore, withProps, withState, withMethods, patchState } from '@ngrx/signals';
import { WeddingStore } from './wedding.store';
import { GuestDragData } from '../../../core/models';
import { uuidToHexColor } from '../../../core/helpers';
import { CdkDragStart } from '@angular/cdk/drag-drop';

interface WeddingDragData {
  currentGroupId: string | null;
  listPresentation: boolean;
}

export const WeddingDragStore = signalStore(
  { providedIn: 'root' },
  withState<WeddingDragData>({ currentGroupId: null, listPresentation: true }),
  withProps(() => ({
    weddingStore: inject(WeddingStore),
  })),
  withMethods((state) => ({
    getTableColor(number: Signal<number | undefined>): Signal<string> {
      return computed(() => {
        const tableNumber = number();
        const currentGroupId = state.currentGroupId();
        if (tableNumber === undefined || currentGroupId === null) {
          return uuidToHexColor(null);
        }
        return state.weddingStore.tablesGroupsMap().get(tableNumber)?.includes(currentGroupId)
          ? uuidToHexColor(currentGroupId)
          : uuidToHexColor(null);
      });
    },
    dragStart(event: CdkDragStart<GuestDragData>) {
      const { guest, tableNumber } = event.source.data;
      const currentGroupId = guest.groupId ?? null;
      const listPresentation = tableNumber === null;
      if (state.currentGroupId() !== currentGroupId || listPresentation !== state.listPresentation()) {
        patchState(state, (oldState): WeddingDragData => ({ ...oldState, currentGroupId, listPresentation }));
      }
    },
    dragReleased() {
      const currentGroupId = state.currentGroupId();
      if (currentGroupId !== null) {
        patchState(state, (oldState): WeddingDragData => ({ ...oldState, currentGroupId: null }));
      }
    },
    dropListEntered(listPresentation: boolean) {
      if (listPresentation !== state.listPresentation()) {
        patchState(state, (oldState): WeddingDragData => ({ ...oldState, listPresentation }));
      }
    },
  })),
);
