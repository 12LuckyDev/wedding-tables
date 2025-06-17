import { BooleanFormatter, ExportConfig, Guest, Metadata, MetadataFieldConfig, Table } from '../../models';

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
    //TODO add counters
    builder.push(metadataText);
  });

  return builder.length > 0 ? `\t${builder.join(', ')}` : null;
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
    });
  return builder.join('\n');
};
