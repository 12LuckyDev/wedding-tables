import { Injectable } from '@angular/core';
import { Guest, TableModel, Wedding, WeddingStorage } from '../models';
import { mappify, nMap } from '@12luckydev/utils';

const WEDDING_STORAGE_KEY = 'Wedding';

@Injectable({ providedIn: 'root' })
export class WeddingStorageService {
  public setWeddingData({ tables, _allGuests }: Wedding): void {
    const storageModel: WeddingStorage = { tables, allGuests: [..._allGuests.values()] };
    localStorage.setItem(WEDDING_STORAGE_KEY, JSON.stringify(storageModel));
  }

  public getWeddingData(): Wedding {
    const data = localStorage.getItem(WEDDING_STORAGE_KEY);
    if (!data) {
      return { tables: nMap(3, (i) => new TableModel(i + 1)), guestIds: [], _allGuests: new Map<string, Guest>() };
    }

    const { tables, allGuests } = JSON.parse(data) as WeddingStorage;

    const atTable = tables.flatMap(({ chairs }) => chairs).filter((guestId) => guestId !== null);
    const wedding: Wedding = {
      tables,
      guestIds: allGuests.map(({ id }) => id).filter((id) => !atTable.includes(id)),
      _allGuests: mappify(allGuests, 'id'),
    };

    return wedding;
  }
}
