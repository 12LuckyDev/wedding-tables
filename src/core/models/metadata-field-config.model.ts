import { MetadataFieldType } from './metadata.type';

export interface MetadataFieldConfig {
  label: string;
  types: Set<MetadataFieldType>;
  hidden: boolean;
}
