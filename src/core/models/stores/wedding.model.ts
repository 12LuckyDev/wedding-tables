import { mappify, nMap } from '@12luckydev/utils';
import { Guest } from '../guest.model';
import { Table, TableModel } from '../table.model';
import { WeddingStorageModel } from '../wedding-storage.model';

export interface Wedding {
  tables: Table[];
  _allGuests: Map<string, Guest>;
  guestIds: string[];
}

export class WeddingModel implements Wedding {
  public tables: Table[];
  public _allGuests: Map<string, Guest>;
  public guestIds: string[];

  constructor(storageModel?: WeddingStorageModel) {
    if (storageModel) {
      const { tables, allGuests } = storageModel;
      const atTable = tables.flatMap(({ chairs }) => chairs).filter((guestId) => guestId !== null);
      this.tables = tables;
      this.guestIds = allGuests.map(({ id }) => id).filter((id) => !atTable.includes(id));
      this._allGuests = mappify(allGuests, 'id');
    } else {
      this.tables = nMap(3, (i) => new TableModel(i + 1));
      this.guestIds = [];
      this._allGuests = new Map<string, Guest>();
    }
  }
}
