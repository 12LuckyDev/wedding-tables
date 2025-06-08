import { Guest, Wedding } from '../../models';
import { changeGuestAtTable } from './helpers/change-guest-at-table';

export const removeGuestFromTable = (
  oldState: Wedding,
  { id }: Guest,
  index: number,
  previousTableNumber: number,
  previousChairIndex: number,
): Wedding => {
  const { tables: oldTables, guestIds: oldGuestIds } = oldState;
  const tables = changeGuestAtTable(oldTables, null, previousTableNumber, previousChairIndex);
  const guestIds = oldGuestIds.toSpliced(index, 0, id);

  return { ...oldState, tables, guestIds };
};
