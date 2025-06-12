import { MetadataFieldConfig } from './metadata-field-config.model';

export interface ExportConfig {
  anonymize: boolean;
  showMetadata: boolean;
  metadataConfig: Map<string, MetadataFieldConfig>;
}
