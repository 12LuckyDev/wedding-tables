import { nMap } from '@12luckydev/utils';
import { Table } from '../../../models';

export const moveAllGuestOutOfTable = (oldTables: Table[]): [Table[], string[]] => {
  const removedIds: string[] = [];
  const newTables: Table[] = oldTables.map((table) => {
    const guestFromTable = table.chairs.filter((id) => id !== null);
    removedIds.push(...guestFromTable);
    return guestFromTable.length > 0
      ? {
          ...table,
          chairs: nMap(table.chairs.length, () => null),
        }
      : table;
  });
  return [newTables, removedIds];
};
