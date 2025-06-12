import { popByProp } from '@12luckydev/utils';
import { Wedding } from '../../../models';

export const removeTable = (oldState: Wedding, tableNumber?: number): Wedding => {
  if (tableNumber === undefined) {
    return oldState;
  }
  const { tables: oldTables, guestIds } = oldState;
  const [table, tables] = popByProp(oldTables, 'number', tableNumber, true);
  const tableGuestIds = table ? table.chairs.filter((id) => id !== null) : [];
  return { ...oldState, tables, guestIds: tableGuestIds.length > 0 ? [...guestIds, ...tableGuestIds] : guestIds };
};
