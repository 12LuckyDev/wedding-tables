import { BooleanFormatter, ExportConfig, Guest, Table } from '../../models';
import { buildCountersText } from './build-counters-text';
import { buildMetadataLine } from './build-metadata-line';

export const buildExportedContent = (
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
