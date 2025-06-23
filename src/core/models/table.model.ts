import { nMap } from '@12luckydev/utils';

export interface Table {
  number: number;
  chairs: (string | null)[];
}

export class TableModel implements Table {
  public number: number;
  public chairs: (string | null)[];

  constructor(number: number) {
    this.number = number;
    this.chairs = nMap(12, () => null);
  }
}
