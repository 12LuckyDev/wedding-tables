import { Guest } from './guest.model';
import { Table } from './table.model';

export interface Wedding {
  tables: Table[];
  guests: Guest[];
}
