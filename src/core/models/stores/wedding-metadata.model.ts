import { BooleanFormatter } from '../boolean-formatter.model';
import { WeddingMetadataStorage } from '../storage/wedding-metadata-storage.model';

export interface WeddingMetadata {
  _booleanFormatters: BooleanFormatter[];
  _customBooleanFormatters: BooleanFormatter[];
}

const DEFAULT_FORMATTERS: BooleanFormatter[] = [
  { id: 'YES_NO', editable: false, trueLabel: 'Yes', falseLabel: 'No' },
  { id: 'TRUE_FALSE', editable: false, trueLabel: 'True', falseLabel: 'False' },
];

export class WeddingMetadataModel implements WeddingMetadata {
  public _booleanFormatters: BooleanFormatter[];
  public _customBooleanFormatters: BooleanFormatter[];

  constructor(storage?: WeddingMetadataStorage) {
    this._booleanFormatters = DEFAULT_FORMATTERS;
    this._customBooleanFormatters = storage?.customBooleanFormatters ?? [];
  }
}
