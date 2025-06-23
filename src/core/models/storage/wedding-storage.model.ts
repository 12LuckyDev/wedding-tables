import { Guest } from '../guest.model';
import { Wedding } from '../stores/wedding.model';
import { Table } from '../table.model';

export interface WeddingStorage {
  tables: Table[];
  allGuests: Guest[];
}

export class WeddingStorageModel implements WeddingStorage {
  public tables: Table[];
  public allGuests: Guest[];

  constructor({ tables, _allGuests }: Wedding) {
    this.tables = tables;
    this.allGuests = [..._allGuests.values()];
  }
}
