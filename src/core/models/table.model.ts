import { nMap } from '@12luckydev/utils';

export interface Table {
  number: number;
  size: number;
  chairs: (string | null)[];
}

export class TableModel implements Table {
  public number: number;
  public size: number;
  public chairs: (string | null)[];

  constructor(number: number) {
    this.number = number;
    this.size = 12;
    this.chairs = nMap(this.size, () => null);
  }
}
