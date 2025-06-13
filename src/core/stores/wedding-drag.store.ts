import { computed, inject, Signal } from '@angular/core';
import { signalStore, withProps, withState, withMethods, patchState } from '@ngrx/signals';
import { WeddingStore } from './wedding.store';
import { Color, GuestDragData, WeddingDragData } from '../models';
import { buildColor } from '../helpers';
import { CdkDragStart } from '@angular/cdk/drag-drop';

export const WeddingDragStore = signalStore(
  { providedIn: 'root' },
  withState<WeddingDragData>({ currentGroupId: null, listPresentation: true }),
  withProps(() => ({
    weddingStore: inject(WeddingStore),
  })),
  withMethods((state) => ({
    getTableColor(number: Signal<number | undefined>): Signal<Color> {
      return computed(() => {
        const tableNumber = number();
        const currentGroupId = state.currentGroupId();
        if (tableNumber === undefined || currentGroupId === null) {
          return buildColor(null);
        }
        const includes = state.weddingStore.tablesGroupsMap().get(tableNumber)?.includes(currentGroupId) ?? false;
        return buildColor(includes ? currentGroupId : null);
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
