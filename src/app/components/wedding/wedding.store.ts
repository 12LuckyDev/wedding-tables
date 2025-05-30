import { editAt, editPropAt, move, nMap } from '@12luckydev/utils';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Table, Guest, Wedding, GuestImportSummaryModel, GroupImportType } from '../../../core/models';
import { ALL_GUESTS } from './wedding.test-data';
import { calcFontContrast, uuidToHexColor } from '../../../core/helpers';
import { computed, Signal } from '@angular/core';

const changeQuestAtTable = (
  tables: Table[],
  guest: string | null,
  tableNumber: number,
  chairIndex: number,
): Table[] => {
  const tableIndex = tables.findIndex(({ number }) => number === tableNumber);

  return tableIndex === -1
    ? tables
    : editPropAt(tables, 'chairs', editAt(tables[tableIndex].chairs, guest, chairIndex), tableIndex);
};

const patchWeddingState = (
  state: Wedding,
  stateChanged: { tables?: Table[]; guestIds?: string[]; allGuests?: Guest[] },
): Wedding => {
  const newState = { ...state };

  if (stateChanged.tables) {
    newState.tables = stateChanged.tables;
  }
  if (stateChanged.guestIds) {
    newState.guestIds = stateChanged.guestIds;
  }
  if (stateChanged.allGuests) {
    newState.allGuests = stateChanged.allGuests;
  }
  return newState;
};

export const WeddingStore = signalStore(
  { providedIn: 'root' },
  withState<Wedding>({
    tables: [
      { number: 1, size: 12, chairs: nMap(12, () => null) },
      { number: 2, size: 12, chairs: nMap(12, () => null) },
      { number: 3, size: 12, chairs: nMap(12, () => null) },
    ],
    allGuests: [...ALL_GUESTS],
    guestIds: ALL_GUESTS.map((el) => el.id),
  }),
  withComputed(({ guestIds, allGuests }) => ({
    guests: computed(() => {
      const all = allGuests();
      const guests = guestIds()
        .map((id) => all.find((g) => g.id === id))
        .filter((g) => !!g);
      return guests;
    }),
  })),
  withMethods((state) => ({
    getTable(number: Signal<number | undefined>): Signal<Table | null> {
      return computed(() => state.tables().find((t) => t.number === number()) ?? null);
    },
    getGuest(guestId: Signal<string | null>): Signal<Guest | null> {
      return computed(() => state.allGuests().find((g) => g.id === guestId()) ?? null);
    },
    addTable() {
      const oldTables = state.tables();
      const tables = [
        ...oldTables,
        {
          number: oldTables.length + 1,
          size: 12,
          chairs: nMap(12, () => null),
        },
      ];
      patchState(state, (oldState): Wedding => patchWeddingState(oldState, { tables }));
    },
    removeTable(table: number) {
      const tables = state.tables().filter((t) => t.number !== table);
      patchState(state, (oldState): Wedding => patchWeddingState(oldState, { tables }));
    },
    moveGuestFromList({ id }: Guest, tableNumber: number, chairIndex: number) {
      const tables = changeQuestAtTable(state.tables(), id, tableNumber, chairIndex);
      const guestIds = state.guestIds().filter((guestId) => guestId !== id);

      patchState(state, (oldState): Wedding => patchWeddingState(oldState, { tables, guestIds }));
    },
    moveGuestBetweenTables(
      { id }: Guest,
      tableNumber: number,
      previousTableNumber: number,
      chairIndex: number,
      previousChairIndex: number,
    ) {
      if (tableNumber === previousTableNumber && chairIndex === previousChairIndex) {
        return;
      }

      const tablesAfterAdd = changeQuestAtTable(state.tables(), id, tableNumber, chairIndex);
      const tablesAfterRemove = changeQuestAtTable(tablesAfterAdd, null, previousTableNumber, previousChairIndex);
      patchState(state, (oldState): Wedding => patchWeddingState(oldState, { tables: tablesAfterRemove }));
    },
    removeGuestFromTable({ id }: Guest, index: number, previousTableNumber: number, previousChairIndex: number) {
      const tables = changeQuestAtTable(state.tables(), null, previousTableNumber, previousChairIndex);
      const guestIds = state.guestIds().toSpliced(index, 0, id);

      patchState(state, (oldState): Wedding => patchWeddingState(oldState, { tables, guestIds }));
    },
    moveGuestInList(from: number, to: number) {
      const guestIds = move(state.guestIds(), from, to);
      patchState(state, (oldState): Wedding => patchWeddingState(oldState, { guestIds }));
    },
    importGuests({ groups, newSingleGuests }: GuestImportSummaryModel) {
      const newGuest = [...newSingleGuests];

      groups.forEach((group) => {
        switch (group.type) {
          case GroupImportType.newGroup:
          case GroupImportType.existingGroup: //TODO add group to existing guests
            const [groupId] = group.groupIds;
            const bgColor = uuidToHexColor(groupId);
            const color = calcFontContrast(bgColor);
            group.newGuests.forEach((g) => newGuest.push({ ...g, groupId, bgColor, color }));
            break;
          case GroupImportType.manyGroups:
            //TODO
            break;
        }
      });

      const allGuests = [...state.allGuests(), ...newGuest];
      const guestIds = [...state.guestIds(), ...newGuest.map(({ id }) => id)];

      patchState(state, (oldState): Wedding => patchWeddingState(oldState, { guestIds, allGuests }));
    },
  })),
);
