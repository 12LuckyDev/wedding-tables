import { MetadataField, MetadataFieldType } from './metadata.type';

export interface MetadataFieldConfig {
  key: string;
  label: string;
  types: Set<MetadataFieldType>;
  values: Set<MetadataField>;
  hidden: boolean;
  formatterId?: string;
}
