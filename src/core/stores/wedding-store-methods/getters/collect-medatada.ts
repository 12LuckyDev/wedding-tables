import { Guest, MetadataField, MetadataFieldConfig, MetadataFieldType } from '../../../models';
import { sentenceCase } from 'change-case';

export const collectMedatada = (guests: Guest[]): Map<string, MetadataFieldConfig> => {
  const map = new Map<string, MetadataFieldConfig>();
  guests.forEach(({ metadata }) => {
    if (!metadata) {
      return;
    }

    for (const key in metadata) {
      const value: MetadataField = metadata[key];
      const type: MetadataFieldType = typeof value as MetadataFieldType;

      if (!map.has(key)) {
        map.set(key, { key, label: sentenceCase(key), types: new Set<MetadataFieldType>([type]), hidden: false });
        continue;
      }

      const fieldType = map.get(key)!;
      fieldType.types.add(type);
    }
  });

  return map;
};
