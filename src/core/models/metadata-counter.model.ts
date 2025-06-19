import { MetadataField } from './metadata.type';

export interface MetadataCounter {
  label: string;
  scope: {
    global: boolean;
    table: boolean;
  };
  values: MetadataField[];
}
