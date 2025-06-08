import { editPropAt, editAt } from '@12luckydev/utils';
import { Table } from '../../../models';

export const changeGuestAtTable = (
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
