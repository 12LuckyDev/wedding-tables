import { MetadataFieldType } from './metadata.type';

export interface MetadataFieldConfig {
  name: string;
  types: Set<MetadataFieldType>;
  hidden: boolean;
}
