import { BooleanFormatter } from '../boolean-formatter.model';
import { WeddingMetadata } from '../stores/wedding-metadata.model';

export interface WeddingMetadataStorage {
  customBooleanFormatters: BooleanFormatter[];
}

export class WeddingMetadataStorageModel implements WeddingMetadataStorage {
  public customBooleanFormatters: BooleanFormatter[];

  constructor(model: WeddingMetadata) {
    this.customBooleanFormatters = model._customBooleanFormatters;
  }
}
