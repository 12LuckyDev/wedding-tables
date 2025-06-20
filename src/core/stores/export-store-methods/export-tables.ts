import {
  BooleanFormatter,
  ExportConfig,
  Guest,
  Metadata,
  MetadataField,
  MetadataFieldConfig,
  Table,
} from '../../models';

const applyBooleanFormatter = (value: boolean, formatters: BooleanFormatter[], formatterId?: string): string => {
  const formatter = formatters.find(({ id }) => id === formatterId);

  if (!formatter) {
    return String(value);
  }

  return value ? formatter.trueLabel : formatter.falseLabel;
};

const buildMetadataLine = (
  metadataConfig: Map<string, MetadataFieldConfig>,
  metadata: Metadata,
  booleanFormatters: BooleanFormatter[],
): string | null => {
  const builder: string[] = [];

  metadataConfig.forEach((config, key) => {
    if (!(key in metadata)) {
      return;
    }

    const { hidden, label, formatterId, isBoolean } = config;

    if (hidden) {
      return;
    }

    let metadataText = '';
    if (!!label) {
      metadataText += `${label}: `;
    }
    const value = metadata[key];
    metadataText += isBoolean ? applyBooleanFormatter(value as boolean, booleanFormatters, formatterId) : value;
    builder.push(metadataText);
  });

  return builder.length > 0 ? `\t${builder.join(', ')}` : null;
};

const buildCountersText = (
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

export const exportTables = (
  { anonymize, showMetadata, metadataConfig }: ExportConfig,
  tables: Table[],
  allGuests: Map<string, Guest>,
  booleanFormatters: BooleanFormatter[],
): string => {
  const sittedGuests: Guest[] = [];
  const builder: string[] = [];

  tables
    .toSorted((a, b) => a.number - b.number)
    .forEach(({ number, chairs }) => {
      const guests: Guest[] = chairs.filter((id) => !!id).map((id) => allGuests.get(id!)!);
      sittedGuests.push(...guests);

      if (guests.length === 0) {
        return;
      }

      builder.push(`Table: ${number}:`);
      builder.push(`Guests amount: ${guests.length}:`);
      if (!anonymize) {
        guests.forEach(({ name, metadata }) => {
          let line = `\t${name}`;

          if (showMetadata && metadata) {
            const text = buildMetadataLine(metadataConfig, metadata, booleanFormatters);
            if (text) {
              line += text;
            }
          }

          builder.push(line);
        });
      }

      const tableCountersText = buildCountersText(guests, metadataConfig, booleanFormatters, false);
      if (tableCountersText) {
        builder.push('');
        builder.push(tableCountersText);
      }

      builder.push('');
    });

  const globalCountersText = buildCountersText(sittedGuests, metadataConfig, booleanFormatters, true);
  if (globalCountersText) {
    builder.push('');
    builder.push(globalCountersText);
  }

  return builder.join('\n');
};
