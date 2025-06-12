import { MetadataFieldType } from './metadata.type';

export interface MetadataFieldConfig {
  types: Set<MetadataFieldType>;
  hidden?: boolean;
}
