import { Injectable } from '@angular/core';
import { Wedding, WeddingModel, WeddingStorage, WeddingStorageModel } from '../models';

const WEDDING_STORAGE_KEY = 'Wedding';

@Injectable({ providedIn: 'root' })
export class WeddingStorageService {
  public setWeddingData(wedding: Wedding): void {
    localStorage.setItem(WEDDING_STORAGE_KEY, JSON.stringify(new WeddingStorageModel(wedding)));
  }

  public getWeddingData(): Wedding {
    const data = localStorage.getItem(WEDDING_STORAGE_KEY);
    return data ? new WeddingModel(JSON.parse(data) as WeddingStorage) : new WeddingModel();
  }
}
