import { Guest, Wedding } from '../../models';
import { changeGuestAtTable } from './helpers/change-guest-at-table';

export const moveGuestFromList = (
  oldState: Wedding,
  { id }: Guest,
  tableNumber: number,
  chairIndex: number,
): Wedding => {
  const { tables: oldTables, guestIds: oldGuestIds } = oldState;
  const tables = changeGuestAtTable(oldTables, id, tableNumber, chairIndex);
  const guestIds = oldGuestIds.filter((guestId) => guestId !== id);
  return { ...oldState, tables, guestIds };
};
