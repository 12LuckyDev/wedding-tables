import { Guest } from './guest.model';
import { Table } from './table.model';

export interface WeddingStorage {
  tables: Table[];
  allGuests: Guest[];
}
