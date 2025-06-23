import { Guest, MetadataFieldConfig, BooleanFormatter, MetadataField } from '../../models';
import { applyBooleanFormatter } from './apply-boolean-formatters';

export const buildCountersText = (
  guests: Guest[],
  metadataConfig: Map<string, MetadataFieldConfig>,
  booleanFormatters: BooleanFormatter[],
  global: boolean,
): string | null => {
  const builder: string[] = [];

  metadataConfig.forEach((config, key) => {
    const { counters, isBoolean, formatterId } = config;
    const filteredCounters = global
      ? counters.filter(({ scope }) => scope.global)
      : counters.filter(({ scope }) => scope.table);

    filteredCounters.forEach(({ values, label }) => {
      const count = new Map<MetadataField, number>();
      guests.forEach(({ metadata }) => {
        if (!metadata) {
          return;
        }
        const value = metadata[key];
        if (values.length === 0 || values.includes(value)) {
          count.set(value, (count.get(value) ?? 0) + 1);
        }
      });

      if (count.size === 0) {
        return;
      }

      if (values.length === 1) {
        const [valueCount] = count.values();
        const [value] = count.keys();
        const formatted = isBoolean ? applyBooleanFormatter(value as boolean, booleanFormatters, formatterId) : value;

        builder.push(`${label ?? formatted}: ${valueCount}`);
      } else {
        if (label) {
          builder.push(`\n${label}:`);
        }
        count.forEach((valueCount, value) => {
          const formatted = isBoolean ? applyBooleanFormatter(value as boolean, booleanFormatters, formatterId) : value;
          builder.push(`\t${formatted}: ${valueCount}`);
        });
      }
    });
  });

  return builder.length > 0 ? builder.join('\n') : null;
};
