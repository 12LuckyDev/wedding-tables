import { Injectable } from '@angular/core';
import {
  Wedding,
  WeddingMetadata,
  WeddingMetadataModel,
  WeddingMetadataStorage,
  WeddingMetadataStorageModel,
  WeddingModel,
  WeddingStorage,
  WeddingStorageModel,
} from '../models';

const WEDDING_STORAGE_KEY = 'Wedding';
const WEDDING_METADATA_CONFIG_STORAGE_KEY = 'WeddingMetadataConfig';

@Injectable({ providedIn: 'root' })
export class WeddingStorageService {
  public setWeddingData(model: Wedding): void {
    localStorage.setItem(WEDDING_STORAGE_KEY, JSON.stringify(new WeddingStorageModel(model)));
  }

  public getWeddingData(): Wedding {
    const data = localStorage.getItem(WEDDING_STORAGE_KEY);
    return data ? new WeddingModel(JSON.parse(data) as WeddingStorage) : new WeddingModel();
  }

  public setWeddingMetadataConfig(model: WeddingMetadata): void {
    localStorage.setItem(WEDDING_METADATA_CONFIG_STORAGE_KEY, JSON.stringify(new WeddingMetadataStorageModel(model)));
  }

  public getWeddingMetadataConfig(): WeddingMetadata {
    const data = localStorage.getItem(WEDDING_METADATA_CONFIG_STORAGE_KEY);
    return data ? new WeddingMetadataModel(JSON.parse(data) as WeddingMetadataStorage) : new WeddingMetadataModel();
  }
}
