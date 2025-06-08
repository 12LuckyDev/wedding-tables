import { TableModel, Wedding } from '../../models';

export const addTable = (oldState: Wedding): Wedding => {
  const { tables } = oldState;
  const tableNumbers = tables.map(({ number }) => number);
  let tableNumber = 1;
  while (true) {
    if (!tableNumbers.includes(tableNumber)) {
      break;
    }
    tableNumber++;
  }

  return { ...oldState, tables: [...tables, new TableModel(tableNumber)] };
};
