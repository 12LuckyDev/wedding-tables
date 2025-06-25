import { editPropAt, insertAt } from '@12luckydev/utils';
import { Wedding } from '../../../models';

export const addChair = (oldState: Wedding, tableNumber?: number): Wedding => {
  const { tables: oldTables } = oldState;
  const tableIndex = oldTables.findIndex(({ number }) => number === tableNumber) ?? null;
  if (tableIndex > -1) {
    const { chairs } = oldTables[tableIndex];
    const firstEmptyIndex = chairs.indexOf(null) + 1;
    return {
      ...oldState,
      tables: editPropAt(oldTables, 'chairs', insertAt(chairs, firstEmptyIndex, null), tableIndex),
    };
  }
  return oldState;
};
