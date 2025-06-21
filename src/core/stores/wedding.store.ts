import { getState, patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Table, Guest, Wedding, GuestImportSummaryModel, MetadataFieldConfig } from '..//models';
import { computed, effect, inject, Signal } from '@angular/core';
import { addTable } from './wedding-store-methods/updaters/add-table';
import { removeTable } from './wedding-store-methods/updaters/remove-table';
import { addChair } from './wedding-store-methods/updaters/add-chair';
import { removeChair } from './wedding-store-methods/updaters/remove-chair';
import { moveGuestFromList } from './wedding-store-methods/updaters/move-guest-from-list';
import { moveGuestBetweenTables } from './wedding-store-methods/updaters/move-guest-between-tables';
import { removeGuestFromTable } from './wedding-store-methods/updaters/remove-guest-from-table';
import { moveGuestInList } from './wedding-store-methods/updaters/move-guest-in-list';
import { importGuest } from './wedding-store-methods/updaters/import-guest';
import { collectMedatada } from './wedding-store-methods/getters/collect-medatada';
import { WeddingStorageService } from '../services/wedding-storage.service';

export const WeddingStore = signalStore(
  { providedIn: 'root' },
  withState<Wedding>(() => inject(WeddingStorageService).getWeddingData()),
  withComputed(({ _allGuests, guestIds, tables }) => ({
    guests: computed(() => {
      const guestMap = _allGuests();
      return guestIds()
        .map((id) => guestMap.get(id))
        .filter((g) => !!g);
    }),
    allGuestCount: computed(() => _allGuests().size),
    tablesGroupsMap: computed(() => {
      const groupMap = new Map<number, string[]>();
      const guestMap = _allGuests();
      tables().forEach(({ number, chairs }) => {
        const groupsIds = chairs
          .map((id) => (id ? (guestMap.get(id)?.groupId ?? null) : null))
          .filter((groupId) => groupId !== null);
        groupMap.set(number, [...new Set(groupsIds)]);
      });
      return groupMap;
    }),
  })),
  withMethods((state) => ({
    getTable(number: Signal<number | undefined>): Signal<Table | null> {
      return computed(() => state.tables().find((t) => t.number === number()) ?? null);
    },
    getAllGuestMap() {
      return new Map(state._allGuests());
    },
    getGuest(guestId: Signal<string | null>): Signal<Guest | null> {
      return computed(() => {
        const id = guestId();
        return id ? (state._allGuests().get(id) ?? null) : null;
      });
    },
    collectMedatada(): Map<string, MetadataFieldConfig> {
      const guestIds = state.guestIds();
      const allGuests = state._allGuests();
      const allGuestIds = [...allGuests.keys()];
      const assignedGuests = allGuestIds.filter((id) => !guestIds.includes(id)).map((id) => allGuests.get(id)!);
      return collectMedatada(assignedGuests);
    },
    addTable() {
      patchState(state, addTable);
    },
    removeTable(tableNumber: Signal<number | undefined>) {
      patchState(state, (oldState) => removeTable(oldState, tableNumber()));
    },
    addChair(tableNumber: Signal<number | undefined>) {
      patchState(state, (oldState) => addChair(oldState, tableNumber()));
    },
    removeChair(tableNumber: Signal<number | undefined>) {
      patchState(state, (oldState) => removeChair(oldState, tableNumber()));
    },
    moveGuestFromList(guest: Guest, tableNumber: number, chairIndex: number) {
      patchState(state, (oldState) => moveGuestFromList(oldState, guest, tableNumber, chairIndex));
    },
    moveGuestBetweenTables(
      guest: Guest,
      tableNumber: number,
      previousTableNumber: number,
      chairIndex: number,
      previousChairIndex: number,
    ) {
      patchState(state, (oldState) =>
        moveGuestBetweenTables(oldState, guest, tableNumber, previousTableNumber, chairIndex, previousChairIndex),
      );
    },
    removeGuestFromTable(guest: Guest, index: number, previousTableNumber: number, previousChairIndex: number) {
      patchState(state, (oldState) =>
        removeGuestFromTable(oldState, guest, index, previousTableNumber, previousChairIndex),
      );
    },
    moveGuestInList(from: number, to: number) {
      patchState(state, (oldState) => moveGuestInList(oldState, from, to));
    },
    importGuests(summary: GuestImportSummaryModel) {
      patchState(state, (oldState) => importGuest(oldState, summary));
    },
  })),
  withHooks({
    onInit(store) {
      const weddingStorageService = inject(WeddingStorageService);
      let initialRun = true;

      effect(() => {
        const state: Wedding = getState(store);
        if (!initialRun) {
          weddingStorageService.setWeddingData(state);
        }
        initialRun = false;
      });
    },
  }),
);
