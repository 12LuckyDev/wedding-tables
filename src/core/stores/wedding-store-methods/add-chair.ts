import { editPropAt } from '@12luckydev/utils';
import { Wedding } from '../../models';

export const addChair = (oldState: Wedding, tableNumber?: number): Wedding => {
  const { tables: oldTables } = oldState;
  const tableIndex = oldTables.findIndex(({ number }) => number === tableNumber) ?? null;
  if (tableIndex > -1) {
    const { chairs } = oldTables[tableIndex];
    return { ...oldState, tables: editPropAt(oldTables, 'chairs', [...chairs, null], tableIndex) };
  }
  return oldState;
};
