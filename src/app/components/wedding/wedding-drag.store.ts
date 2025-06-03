import { computed, inject, Signal } from '@angular/core';
import { signalStore, withProps, withState, withMethods, patchState } from '@ngrx/signals';
import { WeddingStore } from './wedding.store';
import { Guest, GuestDragData } from '../../../core/models';
import { uuidToHexColor } from '../../../core/helpers';
import { CdkDragStart } from '@angular/cdk/drag-drop';

interface WeddingDragData {
  currentGroupId: string | null;
}

export const WeddingDragStore = signalStore(
  { providedIn: 'root' },
  withState<WeddingDragData>({ currentGroupId: null }),
  withProps(() => ({
    weddingStore: inject(WeddingStore),
  })),
  withMethods((state) => ({
    getTableColor(number: Signal<number | undefined>): Signal<string | null> {
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
    dragStart({ source }: CdkDragStart<GuestDragData>) {
      const groupId = source.data.guest.groupId ?? null;
      const currentGroupId = state.currentGroupId();
      if (currentGroupId !== groupId) {
        patchState(state, (oldState): WeddingDragData => ({ ...oldState, currentGroupId: groupId }));
      }
    },
    dragReleased() {
      const currentGroupId = state.currentGroupId();
      if (currentGroupId !== null) {
        patchState(state, (oldState): WeddingDragData => ({ ...oldState, currentGroupId: null }));
      }
    },
  })),
);
