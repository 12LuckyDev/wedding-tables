import { Guest, MetadataField, MetadataFieldConfig, MetadataFieldType } from '../../../models';

export const collectMedatada = (allGuests: Map<string, Guest>): Map<string, MetadataFieldConfig> => {
  const map = new Map<string, MetadataFieldConfig>();
  allGuests.forEach(({ metadata }) => {
    if (!metadata) {
      return;
    }

    for (const key in metadata) {
      const value: MetadataField = metadata[key];
      const type: MetadataFieldType = typeof value as MetadataFieldType;

      if (!map.has(key)) {
        map.set(key, { types: new Set<MetadataFieldType>([type]) });
        return;
      }

      const fieldType = map.get(key)!;
      fieldType.types.add(type);
    }
  });

  return map;
};
