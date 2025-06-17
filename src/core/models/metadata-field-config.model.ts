import { MetadataFieldType } from './metadata.type';

export interface MetadataFieldConfig {
  key: string;
  label: string;
  types: Set<MetadataFieldType>;
  hidden: boolean;
  formatterId?: string;
}
