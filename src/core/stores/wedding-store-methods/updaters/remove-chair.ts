import { editPropAt, popAt, removeAt } from '@12luckydev/utils';
import { Wedding } from '../../../models';

export const removeChair = (oldState: Wedding, tableNumber?: number): Wedding => {
  const { tables: oldTables, guestIds } = oldState;
  const tableIndex = oldTables.findIndex(({ number }) => number === tableNumber);

  if (tableIndex < 0) {
    return oldState;
  }

  const { chairs } = oldTables[tableIndex];
  const emptyChairIndex = chairs.lastIndexOf(null);
  if (emptyChairIndex > -1) {
    return {
      ...oldState,
      tables: editPropAt(oldTables, 'chairs', removeAt(chairs, emptyChairIndex), tableIndex),
    };
  } else {
    const [guestId, newChairs] = popAt(chairs, chairs.length - 1);
    return {
      ...oldState,
      tables: editPropAt(oldTables, 'chairs', newChairs, tableIndex),
      guestIds: guestId ? [...guestIds, guestId] : guestIds,
    };
  }
};
