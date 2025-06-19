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
}
