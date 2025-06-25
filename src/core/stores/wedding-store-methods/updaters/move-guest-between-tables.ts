import { Guest, Wedding } from '../../../models';
import { changeGuestAtTable } from '../helpers/change-guest-at-table';

export const moveGuestBetweenTables = (
  oldState: Wedding,
  { id }: Guest,
  tableNumber: number,
  previousTableNumber: number,
  chairIndex: number,
  previousChairIndex: number,
): Wedding => {
  if (tableNumber === previousTableNumber && chairIndex === previousChairIndex) {
    return oldState;
  }

  const { tables: oldTables } = oldState;

  const tablesAfterAdd = changeGuestAtTable(oldTables, id, tableNumber, chairIndex);
  const oldGuestId = oldTables.find(({ number }) => number === tableNumber)?.chairs?.[chairIndex] ?? null;
  const tablesAfterRemove = changeGuestAtTable(tablesAfterAdd, oldGuestId, previousTableNumber, previousChairIndex);

  return { ...oldState, tables: tablesAfterRemove };
};
