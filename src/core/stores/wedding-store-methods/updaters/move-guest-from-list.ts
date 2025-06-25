import { Guest, Wedding } from '../../../models';
import { changeGuestAtTable } from '../helpers/change-guest-at-table';

export const moveGuestFromList = (
  oldState: Wedding,
  { id }: Guest,
  tableNumber: number,
  chairIndex: number,
): Wedding => {
  const { tables: oldTables, guestIds: oldGuestIds } = oldState;
  const tables = changeGuestAtTable(oldTables, id, tableNumber, chairIndex);
  const guestIds = oldGuestIds.filter((guestId) => guestId !== id);

  const oldGuestId = oldTables.find(({ number }) => number === tableNumber)?.chairs?.[chairIndex] ?? null;
  if (oldGuestId !== null) {
    guestIds.push(oldGuestId);
  }
  return { ...oldState, tables, guestIds };
};
