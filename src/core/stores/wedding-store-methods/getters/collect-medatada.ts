import { Guest, MetadataField, MetadataFieldConfig, MetadataFieldConfigModel } from '../../../models';

export const collectMedatada = (guests: Guest[]): Map<string, MetadataFieldConfig> => {
  const map = new Map<string, MetadataFieldConfig>();
  guests.forEach(({ metadata }) => {
    if (!metadata) {
      return;
    }

    for (const key in metadata) {
      const value: MetadataField = metadata[key];

      if (!map.has(key)) {
        map.set(key, new MetadataFieldConfigModel(key, value));
        continue;
      }

      const fieldConfig = map.get(key)!;
      fieldConfig.addValue(value);
    }
  });

  return map;
};
