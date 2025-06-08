import { Guest, Wedding } from '../../models';
import { changeGuestAtTable } from './helpers/change-guest-at-table';

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
  const tablesAfterRemove = changeGuestAtTable(tablesAfterAdd, null, previousTableNumber, previousChairIndex);
  return { ...oldState, tables: tablesAfterRemove };
};
