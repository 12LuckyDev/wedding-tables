import { editAt, editPropAt, move, nMap, removeByProp } from '@12luckydev/utils';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Table, Guest, Wedding, GuestImportSummaryModel, GroupImportType } from '../../../core/models';
import { ALL_GUESTS } from './wedding.test-data';
import { calcFontContrast, uuidToHexColor } from '../../../core/helpers';

const addQuestToTable = (tables: Table[], guest: Guest, tableNumber: number, chairIndex: number): Table[] | null => {
  const tableIndex = tables.findIndex(({ number }) => number === tableNumber);
  if (tableIndex === -1) {
    return null;
  }

  return editPropAt(tables, 'chairs', editAt(tables[tableIndex].chairs, guest, chairIndex), tableIndex);
};

const removeQuestFromTable = (tables: Table[], tableNumber: number, chairIndex: number): Table[] | null => {
  const tableIndex = tables.findIndex(({ number }) => number === tableNumber);
  if (tableIndex === -1) {
    return null;
  }

  return editPropAt(tables, 'chairs', editAt(tables[tableIndex].chairs, null, chairIndex), tableIndex);
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
    guests: [...ALL_GUESTS],
  }),
  withMethods((state) => ({
    addTable() {
      patchState(
        state,
        (oldState): Wedding => ({
          ...oldState,
          tables: [
            ...oldState.tables,
            {
              number: oldState.tables.length + 1,
              size: 12,
              chairs: nMap(12, () => null),
            },
          ],
        }),
      );
    },
    removeTable(table: number) {
      patchState(
        state,
        (oldState): Wedding => ({
          ...oldState,
          tables: oldState.tables.filter((t) => t.number !== table),
        }),
      );
    },
    moveGuestFromList(guest: Guest, tableNumber: number, chairIndex: number) {
      const tables = addQuestToTable(state.tables(), guest, tableNumber, chairIndex);
      if (tables === null) {
        return;
      }

      const guests = removeByProp(state.guests(), 'id', guest.id);

      patchState(
        state,
        (oldState): Wedding => ({
          ...oldState,
          guests,
          tables,
        }),
      );
    },
    moveGuestBetweenTables(
      guest: Guest,
      tableNumber: number,
      previousTableNumber: number,
      chairIndex: number,
      previousChairIndex: number,
    ) {
      if (tableNumber === previousTableNumber && chairIndex === previousChairIndex) {
        return;
      }

      const tablesAfterAdd = addQuestToTable(state.tables(), guest, tableNumber, chairIndex);

      if (tablesAfterAdd === null) {
        return;
      }

      const tablesAfterRemove = removeQuestFromTable(tablesAfterAdd, previousTableNumber, previousChairIndex);
      if (tablesAfterRemove === null) {
        return;
      }

      patchState(
        state,
        (oldState): Wedding => ({
          ...oldState,
          tables: tablesAfterRemove,
        }),
      );
    },
    removeGuestFromTable(guest: Guest, index: number, previousTableNumber: number, previousChairIndex: number) {
      const tables = removeQuestFromTable(state.tables(), previousTableNumber, previousChairIndex);
      if (tables === null) {
        return;
      }

      const guests = state.guests().toSpliced(index, 0, guest);

      patchState(
        state,
        (oldState): Wedding => ({
          ...oldState,
          tables,
          guests,
        }),
      );
    },
    moveGuestInList(from: number, to: number) {
      patchState(
        state,
        (oldState): Wedding => ({
          ...oldState,
          guests: move(state.guests(), from, to),
        }),
      );
    },
    importGuests({ groups, newSingleGuests }: GuestImportSummaryModel) {
      const newGuest = [...newSingleGuests];

      groups.forEach((group) => {
        switch (group.type) {
          case GroupImportType.newGroup:
          case GroupImportType.existingGroup:
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

      patchState(
        state,
        (oldState): Wedding => ({
          ...oldState,
          allGuests: [...state.allGuests(), ...newGuest],
          guests: [...state.guests(), ...newGuest],
        }),
      );
    },
  })),
);
