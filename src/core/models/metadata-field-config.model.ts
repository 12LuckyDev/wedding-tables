import { sentenceCase } from 'change-case';
import { MetadataCounter } from './metadata-counter.model';
import { MetadataField, MetadataFieldType } from './metadata.type';

export interface MetadataFieldConfig {
  key: string;
  label: string;
  types: Set<MetadataFieldType>;
  values: Set<MetadataField>;
  hidden: boolean;
  formatterId?: string;
  counters: MetadataCounter[];

  get isBoolean(): boolean;
  addValue(value: MetadataField): void;
}

export class MetadataFieldConfigModel implements MetadataFieldConfig {
  public key: string;
  public label: string;
  public types: Set<MetadataFieldType>;
  public values: Set<MetadataField>;
  public hidden: boolean;
  public formatterId?: string | undefined;
  public counters: MetadataCounter[];

  constructor(key: string, value: MetadataField) {
    this.key = key;
    this.label = sentenceCase(key);
    this.types = new Set<MetadataFieldType>([typeof value as MetadataFieldType]);
    this.values = new Set<MetadataField>([value]);
    this.hidden = false;
    this.counters = [];
  }

  public get isBoolean(): boolean {
    return this.types.size === 1 && this.types.has('boolean');
  }

  public addValue(value: MetadataField): void {
    this.types.add(typeof value as MetadataFieldType);
    this.values.add(value);
  }
}
