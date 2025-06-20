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

    const { hidden, types, label, formatterId } = config;

    if (hidden) {
      return;
    }

    let metadataText = '';
    if (!!label) {
      metadataText += `${label}: `;
    }
    const isBoolean = types.size === 1 && types.has('boolean');
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
    const { counters, formatterId } = config;
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
        const [value] = count.keys(); //TODO formaters

        builder.push(`${label ?? value}: ${valueCount}`);
      } else {
        if (label) {
          builder.push(`\n${label}:`);
        }
        count.forEach((valueCount, value) => {
          builder.push(`\t${value}: ${valueCount}`);
        });
      }
    });
  });

  return builder.length > 0 ? `\t${builder.join('\n')}` : null;
};

export const exportTables = (
  { anonymize, showMetadata, metadataConfig }: ExportConfig,
  tables: Table[],
  allGuests: Map<string, Guest>,
  booleanFormatters: BooleanFormatter[],
): string => {
  const builder: string[] = [];

  tables
    .toSorted((a, b) => a.number - b.number)
    .forEach(({ number, chairs }) => {
      const guests: Guest[] = chairs.filter((id) => !!id).map((id) => allGuests.get(id!)!);

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
      builder.push('\n');

      const tableCountersText = buildCountersText(guests, metadataConfig, booleanFormatters, false);
      if (tableCountersText) {
        builder.push(tableCountersText);
      }
    });

  const globalCountersText = buildCountersText([...allGuests.values()], metadataConfig, booleanFormatters, false);
  if (globalCountersText) {
    builder.push('\n');
    builder.push(globalCountersText);
  }

  return builder.join('\n');
};
