import {
  editAt,
  editPropAt,
  move,
  nMap,
  removeByProp,
} from '@12luckydev/utils';
import { Signal, WritableSignal } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { v4 as uuidv4 } from 'uuid';

export interface Table {
  number: number;
  size: number;
  chairs: (Guest | null)[];
}

export interface Guest {
  id: string;
  name: string;
  initials: string;
}

export interface Wedding {
  tables: Table[];
  guests: Guest[];
}

const PEOPLE = [
  'Bianca Dawson',
  'Iker Adams',
  'Stella Gonzalez',
  'Ethan Woodward',
  'Drew Buchanan',
  'Enrique Buck',
  'Livia Wall',
  'Issac Hernandez',
  'Camila Alexander',
  'Kingston Stokes',
  'Miranda Walls',
  'Larry Esquivel',
];

const addQuestToTable = (
  tables: Table[],
  guest: Guest,
  tableNumber: number,
  chairIndex: number
): Table[] | null => {
  const tableIndex = tables.findIndex(({ number }) => number === tableNumber);
  if (tableIndex === -1) {
    return null;
  }

  return editPropAt(
    tables,
    'chairs',
    editAt(tables[tableIndex].chairs, guest, chairIndex),
    tableIndex
  );
};

const removeQuestFromTable = (
  tables: Table[],
  tableNumber: number,
  chairIndex: number
): Table[] | null => {
  const tableIndex = tables.findIndex(({ number }) => number === tableNumber);
  if (tableIndex === -1) {
    return null;
  }

  return editPropAt(
    tables,
    'chairs',
    editAt(tables[tableIndex].chairs, null, chairIndex),
    tableIndex
  );
};

export const WeddingStore = signalStore(
  withState<Wedding>({
    tables: [
      { number: 1, size: 12, chairs: nMap(12, () => null) },
      { number: 2, size: 12, chairs: nMap(12, () => null) },
      { number: 3, size: 12, chairs: nMap(12, () => null) },
    ],
    guests: PEOPLE.map((name) => ({
      id: uuidv4(),
      name,
      initials: name
        .split(' ')
        .map((part) => part[0] ?? '')
        .join(''),
    })),
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
        })
      );
    },
    removeTable(table: number) {
      patchState(
        state,
        (oldState): Wedding => ({
          ...oldState,
          tables: oldState.tables.filter((t) => t.number !== table),
        })
      );
    },
    moveGuestFromList(guest: Guest, tableNumber: number, chairIndex: number) {
      const tables = addQuestToTable(
        state.tables(),
        guest,
        tableNumber,
        chairIndex
      );
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
        })
      );
    },
    moveGuestBetweenTables(
      guest: Guest,
      tableNumber: number,
      previousTableNumber: number,
      chairIndex: number,
      previousChairIndex: number
    ) {
      if (
        tableNumber === previousTableNumber &&
        chairIndex === previousChairIndex
      ) {
        return;
      }

      const tablesAfterAdd = addQuestToTable(
        state.tables(),
        guest,
        tableNumber,
        chairIndex
      );

      if (tablesAfterAdd === null) {
        return;
      }

      const tablesAfterRemove = removeQuestFromTable(
        tablesAfterAdd,
        previousTableNumber,
        previousChairIndex
      );
      if (tablesAfterRemove === null) {
        return;
      }

      patchState(
        state,
        (oldState): Wedding => ({
          ...oldState,
          tables: tablesAfterRemove,
        })
      );
    },
    removeGuestFromTable(
      guest: Guest,
      index: number,
      previousTableNumber: number,
      previousChairIndex: number
    ) {
      const tables = removeQuestFromTable(
        state.tables(),
        previousTableNumber,
        previousChairIndex
      );
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
        })
      );
    },
    moveGuestInList(from: number, to: number) {
      patchState(
        state,
        (oldState): Wedding => ({
          ...oldState,
          guests: move(state.guests(), from, to),
        })
      );
    },
  }))
);
