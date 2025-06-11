export type MetadataField = string | number | boolean;
export type Metadata = Record<string, MetadataField>;
export type UnparsedMetadata = Record<string, unknown>;
export type MetadataRegistry = Map<string, ('string' | 'number' | 'boolean')[]>;
